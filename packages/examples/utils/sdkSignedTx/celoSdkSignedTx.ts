/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Ethereum } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { ethers, Wallet } from 'ethers';
import { RPC_URL } from '../../constants';
import { getCeloAccount } from '../getAccount';
import { getCeloTx } from '../getTx';

/* Create singedTx and sen by using ethers */
export const celoSdkSignedTx = async (mnemonic: string) => {
  const rpcUrl = RPC_URL.CELO;
  const celo = new ethers.providers.JsonRpcProvider(rpcUrl);
  const privateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.CELO, account: 0, index: 0 },
  });
  const account = getCeloAccount(mnemonic);
  const wallet = new Wallet(privateKey);
  const { unSignedTx } = await getCeloTx(account);

  const signedTx = await wallet.signTransaction(unSignedTx);
  const transaction = ethers.utils.parseTransaction(signedTx);
  const sigature = ethers.utils.joinSignature({
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
  });
  // console.log('sig', sig);
  // const sentTx = await celo.sendTransaction(signedTx);

  return sigature;
};
