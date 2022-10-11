/* eslint-disable camelcase */
import Transport from "@ledgerhq/hw-transport";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import TerraApp, { AddressResponse } from "@terra-money/ledger-terra-js";
import {
  SignDoc,
  SimplePublicKey,
  Coin,
  Fee,
  Tx,
  TxBody,
  AuthInfo,
  SignatureV2,
  Msg,
  SignerInfo,
  ModeInfo,
  sha256,
} from "@terra-money/terra.js";
import { Account, BIP44, SignedTx } from "../../../types";
import { Secp256k1Signature } from "../utils/secp256k1signature";

export class LEDGER {
  static async getAccount(path: BIP44, transport: Transport): Promise<Account> {
    const instance = new TerraApp(transport);
    await instance.initialize();
    const response = (await instance.getAddressAndPubKey(
      [44, path.type, path.account, 0, path.index],
      "terra"
    )) as AddressResponse;
    return {
      address: response.bech32_address,
      publicKey: Buffer.from(response.compressed_pk.data).toString("base64"),
    };
  }

  static async signTx(
    path: BIP44,
    transport: Transport,
    parsedTx: any
  ): Promise<SignedTx> {
    const instance = new TerraApp(transport);

    const { publicKey } = await LEDGER.getAccount(path, transport);

    const pubKey = new SimplePublicKey(publicKey);

    const coins: Coin[] = parsedTx.fee.amount.map((fee: any): any => {
      return new Coin(fee.denom, fee.amount);
    });

    const aminoMsgs = parsedTx.msgs.map((msg: any) => Msg.fromAmino(msg));

    const fee = new Fee(Number.parseInt(parsedTx.fee.gas, 10), coins, "", "");
    const timeoutHeight = 0;
    const tx = new Tx(
      new TxBody(aminoMsgs, parsedTx.memo || "", timeoutHeight),
      new AuthInfo([], fee),
      []
    );

    const txRaw = new Tx(tx.body, new AuthInfo([], tx.auth_info.fee), []);
    const sign_doc = new SignDoc(
      parsedTx.chain_id,
      parseInt(parsedTx.account_number, 10),
      parseInt(parsedTx.sequence, 10),
      txRaw.auth_info,
      txRaw.body
    );
    const response = await instance.sign(
      [44, path.type, path.account, 0, path.index],
      Buffer.from(sign_doc.toAminoJSON())
    );

    const newSig = Secp256k1Signature.fromDer(
      new Uint8Array(response.signature.data)
    );

    const mergedArray = new Uint8Array(newSig.r.length + newSig.s.length);
    mergedArray.set(newSig.r);
    mergedArray.set(newSig.s, newSig.r.length);
    // temp

    const signature = new SignatureV2(
      pubKey,
      new SignatureV2.Descriptor(
        new SignatureV2.Descriptor.Single(
          SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
          Buffer.from(mergedArray).toString("base64")
        )
      ),
      parsedTx.sequence
    );

    const sigData = signature.data.single as SignatureV2.Descriptor.Single;
    txRaw.signatures.push(...tx.signatures, sigData.signature);
    txRaw.auth_info.signer_infos.push(
      ...tx.auth_info.signer_infos,
      new SignerInfo(
        signature.public_key,
        signature.sequence,
        new ModeInfo(new ModeInfo.Single(sigData.mode))
      )
    );

    const txByte = txRaw.toBytes();

    return {
      hash: Buffer.from(sha256(txByte)).toString("hex").toUpperCase(),
      serializedTx: `0x${Buffer.from(txByte).toString("hex")}`,
    };
  }

  /*
  static async signMessage(
    path: BIP44,
    transport: Transport,
    msg: string
  ): Promise<SignedMsg> {
    // ...
  }
  */
}
