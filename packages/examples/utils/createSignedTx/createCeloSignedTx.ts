import { ethers, UnsignedTransaction } from 'ethers';

interface createCeloSignedTxProps {
  unSignedTx: UnsignedTransaction;
  signatrue: string;
}

/* Create singedTx by combining tx and signature */
export const createCeloSignedTx = ({ unSignedTx, signatrue }: createCeloSignedTxProps): string => {
  const signedTx = ethers.utils.serializeTransaction(unSignedTx, signatrue);
  return signedTx;
};

// @TODO use transactionFactory -> celo native transaction
