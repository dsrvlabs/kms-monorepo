import { RPC_URL } from '../../constants';

const ethers = require('ethers');

export const sendEthereumTransaction = async (serializedTx, hash) => {
  const rpcUrl = RPC_URL.ETHEREUM;

  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const ethereum = new ethers.providers.JsonRpcProvider(rpcUrl);

  await ethereum.sendTransaction(serializedTx);
  return { hash };
};
