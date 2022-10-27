import { Transaction } from '@solana/web3.js';

interface createSolanaSignedTxProps {
  unSignedTx: Transaction;
  signature: string;
  mnemonic?: string;
}

export const createSolanaSignedTx = async ({
  unSignedTx,
  signature,
}: createSolanaSignedTxProps) => {
  const bufferSig = Buffer.from(signature.replace('0x', ''), 'hex');
  // const sdkSig = await solanaSdkSignedTx(mnemonic, unSignedTx);

  // console.log('sdksig', sdkSig);
  // unSignedTx.addSignature(unSignedTx.feePayer, sdkSig);
  unSignedTx.addSignature(unSignedTx.feePayer, bufferSig);
  const serializedTx = unSignedTx.serialize().toString('hex');
  return serializedTx;
};
