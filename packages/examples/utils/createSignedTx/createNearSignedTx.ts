/* eslint-disable no-console */
import { Signature, SignedTransaction, Transaction } from 'near-api-js/lib/transaction';

interface createNearSignedTxProps {
  unSignedTx: Transaction;
  signature: string;
}

export const createNearSignedTx = ({ unSignedTx, signature }: createNearSignedTxProps) => {
  const unSignedbytes = unSignedTx.encode();
  const unSignedSerializedTx = Buffer.from(unSignedbytes).toString('base64');
  const transaction = Transaction.decode(Buffer.from(unSignedSerializedTx, 'base64'));

  const signedTx = new SignedTransaction({
    transaction,
    signature: new Signature({
      keyType: transaction.publicKey.keyType,
      data: Buffer.from(signature.replace('0x', ''), 'hex'),
    }),
  });

  const bytes = signedTx.encode();
  const serializedTx = Buffer.from(bytes).toString('base64');

  return serializedTx;
};
