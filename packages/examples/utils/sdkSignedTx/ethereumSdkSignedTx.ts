/* eslint-disable no-undef */
import { Ethereum } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { ethers, Wallet } from 'ethers';
import { RPC_URL } from '../../constants';
import { getEthereumAccount } from '../getAccount';
import { getEthereumTx } from '../getTx';

/* Create singedTx and sen by using ethers */
export const ethereumSdkSignedTx = async (mnemonic: string) => {
  const rpcUrl = RPC_URL.ETHEREUM;
  const ethereum = new ethers.providers.JsonRpcProvider(rpcUrl);
  const privateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  const account = getEthereumAccount(mnemonic);
  const wallet = new Wallet(privateKey);
  const { unSignedTx } = await getEthereumTx(account);
  const signedTx = await wallet.signTransaction(unSignedTx);
  const sentTx = await ethereum.sendTransaction(signedTx);

  return sentTx;
};
