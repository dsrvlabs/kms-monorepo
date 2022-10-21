import { ethers, UnsignedTransaction } from 'ethers';

interface createEthereumSignedTxProps {
  unSignedTx: UnsignedTransaction;
  signatrue: string;
}

/* Create singedTx by combining tx and signature */
export const createEthereumSignedTx = ({
  unSignedTx,
  signatrue,
}: createEthereumSignedTxProps): string => {
  const signedTx = ethers.utils.serializeTransaction(unSignedTx, signatrue);
  return signedTx;
};
