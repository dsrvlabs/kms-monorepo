import { ethers, UnsignedTransaction } from 'ethers';

interface createEthereumSignedTxProps {
  unSignedTx: UnsignedTransaction;
  signature: string;
}

/* Create singedTx by combining tx and signature */
export const createEthereumSignedTx = ({
  unSignedTx,
  signature,
}: createEthereumSignedTxProps): string => {
  const signedTx = ethers.utils.serializeTransaction(unSignedTx, signature);
  return signedTx;
};
