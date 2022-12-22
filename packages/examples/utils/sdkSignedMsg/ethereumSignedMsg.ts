/* eslint-disable no-undef */
import { Wallet } from 'ethers';
import { getEthereumPrivateKey } from '../getPrivateKey';

/* Create singedTx and sen by using ethers */
export const ethereumSdkSignedMsg = async (mnemonic: string, message: string) => {
  const privateKey = getEthereumPrivateKey(mnemonic);

  const wallet = new Wallet(privateKey);

  const signedMsg = await wallet.signMessage(message);

  return signedMsg;
};
