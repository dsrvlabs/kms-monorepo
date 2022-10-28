/* eslint-disable no-undef */
import { ethers, Wallet } from 'ethers';
// import { RPC_URL } from '../../constants';
import { getEthereumAccount } from '../getAccount';
import { getEthereumPrivateKey } from '../getPrivateKey';
import { getEthereumTx } from '../getTx';

/* Create singedTx and sen by using ethers */
export const ethereumSdkSignedTx = async (mnemonic: string) => {
  // const rpcUrl = RPC_URL.ETHEREUM;
  // const ethereum = new ethers.providers.JsonRpcProvider(rpcUrl);
  const privateKey = getEthereumPrivateKey(mnemonic);
  const account = getEthereumAccount(mnemonic);
  const wallet = new Wallet(privateKey);
  const { unSignedTx } = await getEthereumTx(account);

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
