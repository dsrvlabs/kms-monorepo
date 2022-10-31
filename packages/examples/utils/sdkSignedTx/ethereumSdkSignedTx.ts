/* eslint-disable no-undef */
import { ethers, Wallet } from 'ethers';
import { getEthereumPrivateKey } from '../getPrivateKey';
import { getEthereumOfflineTx } from '../getTx';

/* Create singedTx and sen by using ethers */
export const ethereumSdkSignedTx = async (mnemonic: string) => {
  const privateKey = getEthereumPrivateKey(mnemonic);

  const wallet = new Wallet(privateKey);
  const { unSignedTx } = await getEthereumOfflineTx(mnemonic);

  const signedTx = await wallet.signTransaction(unSignedTx);
  const transaction = ethers.utils.parseTransaction(signedTx);
  const sigature = ethers.utils.joinSignature({
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
  });

  // const sentTx = await ethereum.sendTransaction(signedTx);

  return sigature;
};
