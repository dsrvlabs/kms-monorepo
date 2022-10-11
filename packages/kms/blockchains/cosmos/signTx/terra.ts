import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {
  Coin,
  Fee,
  Tx,
  TxBody,
  AuthInfo,
  RawKey,
  sha256,
  Msg,
} from "@terra-money/terra.js";
import { SignedTx } from "../../../types";

export async function terraSignTx(
  privateKey: Buffer,
  _prefix: string,
  parsedTx: any
): Promise<SignedTx> {
  const rawKey = new RawKey(privateKey);

  const coins: Coin[] = parsedTx.fee.amount.map((fee: any): any => {
    return new Coin(fee.denom, fee.amount);
  });

  const fee = new Fee(Number.parseInt(parsedTx.fee.gas, 10), coins);
  const timeoutHeight = 0;
  const aminoMsgs = parsedTx.msgs.map((msg: any) => Msg.fromAmino(msg) || msg);
  const txBody = new TxBody(aminoMsgs, parsedTx.memo || "", timeoutHeight);
  const tx = new Tx(txBody, new AuthInfo([], fee), []);
  const txRaw = await rawKey.signTx(tx, {
    accountNumber: parseInt(parsedTx.account_number, 10),
    sequence: parseInt(parsedTx.sequence, 10),
    signMode: SignMode.SIGN_MODE_DIRECT,
    chainID: parsedTx.chain_id,
  });

  const txByte = txRaw.toBytes();

  return {
    hash: Buffer.from(sha256(txByte)).toString("hex").toUpperCase(),
    serializedTx: `0x${Buffer.from(txByte).toString("hex")}`,
  };
}
