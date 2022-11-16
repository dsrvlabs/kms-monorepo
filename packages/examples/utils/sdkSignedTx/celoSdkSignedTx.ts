/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Ethereum, CHAIN } from '@dsrv/kms';

import { ethers, Wallet } from 'ethers';
import { RPC_URL } from '../../constants';
import { getCeloOfflineTx } from '../getTx';

/* Create singedTx and sen by using ethers */
export const celoSdkSignedTx = async (mnemonic: string) => {
  const rpcUrl = RPC_URL.CELO;
  const celo = new ethers.providers.JsonRpcProvider(rpcUrl);
  const privateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.CELO, account: 0, index: 0 },
  });
  const wallet = new Wallet(privateKey);
  const { unSignedTx } = await getCeloOfflineTx(mnemonic);

  const signedTx = await wallet.signTransaction(unSignedTx);
  const transaction = ethers.utils.parseTransaction(signedTx);

  const sigature = ethers.utils.joinSignature({
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
  });

  return sigature;
};
