/* eslint-disable no-console */
import { Signature, SignedTransaction, Transaction } from 'near-api-js/lib/transaction';

interface createNearSignedTxProps {
  unSignedTx: Transaction;
  signature: string;
}

export const createNearSignedTx = ({ unSignedTx, signature }: createNearSignedTxProps) => {
  const signedTx = new SignedTransaction({
    transaction: unSignedTx,
    signature: new Signature({
      keyType: unSignedTx.publicKey.keyType,
      data: Buffer.from(signature.replace('0x', ''), 'hex'),
    }),
  });
  const bytes = signedTx.encode();
  const serializedTx = Buffer.from(bytes).toString('base64');
  return serializedTx;
};
