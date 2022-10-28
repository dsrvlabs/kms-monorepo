/* eslint-disable no-unused-vars */
import { Account } from '@dsrv/kms/src/types';
import { ethers } from 'ethers';
import { RECEIVER_ADDRESS, RPC_URL } from '../../constants';

export const getCeloTx = async (account: Account) => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL.CELO);
  const nonce = await provider.getTransactionCount(account.address);
  const balance = await provider.getBalance(account.address);
  const gasLimit = await provider.estimateGas({
    value: '0x1',
    to: RECEIVER_ADDRESS.CELO,
    from: account.address,
  });
  const transactionParameters = {
    to: RECEIVER_ADDRESS.CELO,
    value: ethers.utils.parseEther('0.0005'),
    gasLimit: gasLimit.mul(10).toString(),
    //  network
    chainId: 44787,
    type: 1,
    gasPrice: '0x07f9acf02',
    maxPriorityFeePerGas: '0x07f9acf02',
    maxFeePerGas: '0x07f9acf02',
    nonce,
  };

  return {
    serializedTx: ethers.utils.serializeTransaction(transactionParameters),
    unSignedTx: transactionParameters,
  };
};
