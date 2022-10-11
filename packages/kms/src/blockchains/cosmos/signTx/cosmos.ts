import {
  DirectSecp256k1Wallet,
  makeSignDoc,
  makeAuthInfoBytes,
  encodePubkey,
} from "@cosmjs/proto-signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { encodeSecp256k1Pubkey } from "@cosmjs/amino";
import { sha256 } from "ethereumjs-util";
import { SignedTx } from "../../../types";
import { registry } from "../utils/defaultRegistryTypes";

export async function cosmosSignTx(
  privateKey: Buffer,
  prefix: string,
  parsedTx: any
): Promise<SignedTx> {
  const wallet = await DirectSecp256k1Wallet.fromKey(
    new Uint8Array(privateKey),
    prefix
  );
  const accounts = await wallet.getAccounts();

  const txBodyEncodeObject = {
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: parsedTx.msgs,
      memo: parsedTx.memo,
    },
  };

  const txBodyBytes = registry.encode(txBodyEncodeObject);
  const pubkey = encodePubkey(encodeSecp256k1Pubkey(accounts[0].pubkey));

  const signDoc = makeSignDoc(
    txBodyBytes,
    makeAuthInfoBytes(
      [
        {
          pubkey,
          sequence: parsedTx.signerData.sequence,
        },
      ],
      parsedTx.fee.amount,
      parsedTx.fee.gas
    ),
    parsedTx.signerData.chainId,
    parsedTx.signerData.accountNumber
  );

  const { signature, signed } = await wallet.signDirect(
    accounts[0].address,
    signDoc
  );

  const txRaw = TxRaw.fromPartial({
    bodyBytes: signed.bodyBytes,
    authInfoBytes: signed.authInfoBytes,
    signatures: [new Uint8Array(Buffer.from(signature.signature, "base64"))],
  });

  const txByte = TxRaw.encode(txRaw).finish();

  return {
    hash: sha256(Buffer.from(txByte)).toString("hex").toUpperCase(),
    serializedTx: `0x${Buffer.from(txByte).toString("hex")}`,
  };
}
