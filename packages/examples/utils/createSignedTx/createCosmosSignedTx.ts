/* eslint-disable no-unused-vars */
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

interface createCosmosSignedTxProps {
  unSignedTx: any;
  signature: string;
}

export const createCosmosSignedTx = ({ unSignedTx, signature }: createCosmosSignedTxProps) => {
  console.log('unSignedTx', unSignedTx);
  const txRaw = TxRaw.fromPartial({
    bodyBytes: unSignedTx.bodyBytes,
    authInfoBytes: unSignedTx.authInfoBytes,
    signatures: [new Uint8Array(Buffer.from(signature.replace('0x', ''), 'hex'))],
  });

  const txByte = TxRaw.encode(txRaw).finish();
  const signedTx = `0x${Buffer.from(txByte).toString('hex')}`;
  return signedTx;
};
