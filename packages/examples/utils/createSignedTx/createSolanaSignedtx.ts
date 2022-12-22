import { Transaction } from '@solana/web3.js';

interface createSolanaSignedTxProps {
  unSignedTx: Transaction;
  signature: string;
}

export const createSolanaSignedTx = ({ unSignedTx, signature }: createSolanaSignedTxProps) => {
  const bufferSig = Buffer.from(signature.replace('0x', ''), 'hex');
  unSignedTx.addSignature(unSignedTx.feePayer, bufferSig);
  const serializedTx = unSignedTx.serialize().toString('hex');
  return serializedTx;
};
