/* eslint-disable no-undef */
import { Ethereum } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { ethers, Wallet } from 'ethers';
import { RPC_URL } from '../../constants';
import { getEthereumTx } from '../getTx';

/* Create singedTx and sen by using ethers */
export const ethereumSdkSignedTx = async (mnemonic: string) => {
  const rpcUrl = RPC_URL.ETHEREUM;
  const ethereum = new ethers.providers.JsonRpcProvider(rpcUrl);
  const privateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  const wallet = new Wallet(privateKey);
  const { unSignedTx } = getEthereumTx();
  const signedTx = await wallet.signTransaction(unSignedTx);
  const sentTx = await ethereum.sendTransaction(signedTx);

  return sentTx;
};
