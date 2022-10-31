import { ethers } from 'ethers';
import { RECEIVER_ADDRESS, RPC_URL } from '../../constants';
import { getEthereumAccount } from '../getAccount';

export const getEthereumTx = async (mnemonic: string) => {
  const account = getEthereumAccount(mnemonic);
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL.ETHEREUM);
  const nonce = await provider.getTransactionCount(account.address);
  const gasLimit = await provider.estimateGas({
    value: '0x1',
    to: account.address,
  });
  const transactionParameters = {
    to: RECEIVER_ADDRESS.ETHEREUM,
    value: ethers.utils.parseEther('0.0005'),
    gasLimit: gasLimit.mul(10).toString(),
    gasPrice: '0x07f9acf02',
    type: 2,
    nonce,
    // goerli network
    chainId: 5,
    // EIP-1559; Type 2
    maxPriorityFeePerGas: '0x07f9acf02',
    maxFeePerGas: '0x07f9acf02',
  };

  return {
    serializedTx: ethers.utils.serializeTransaction(transactionParameters),
    unSignedTx: transactionParameters,
  };
};

export const getEthereumOfflineTx = async (mnemonic: string) => {
  const account = getEthereumAccount(mnemonic);
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL.ETHEREUM);
  const nonce = await provider.getTransactionCount(account.address);
  const transactionParameters = {
    to: RECEIVER_ADDRESS.ETHEREUM,
    value: ethers.utils.parseEther('0.0005'),
    gasLimit: 3,
    gasPrice: '0x07f9acf02',
    type: 2,
    nonce,
    // goerli network
    chainId: 5,
    // EIP-1559; Type 2
    maxPriorityFeePerGas: '0x07f9acf02',
    maxFeePerGas: '0x07f9acf02',
  };

  return {
    serializedTx: ethers.utils.serializeTransaction(transactionParameters),
    unSignedTx: transactionParameters,
  };
};
