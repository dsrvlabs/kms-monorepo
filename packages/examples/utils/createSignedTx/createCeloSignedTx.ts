import { ethers, UnsignedTransaction } from 'ethers';

interface createCeloSignedTxProps {
  unSignedTx: UnsignedTransaction;
  signature: string;
}

/* Create singedTx by combining tx and signature */
export const createCeloSignedTx = ({ unSignedTx, signature }: createCeloSignedTxProps): string => {
  const signedTx = ethers.utils.serializeTransaction(unSignedTx, signature);
  return signedTx;
};

// @TODO use transactionFactory -> celo native transaction
