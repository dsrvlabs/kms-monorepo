import { RPC_URL } from '../../constants';

const ethers = require('ethers');

export const sendCeloTransaction = async (serializedTx) => {
  const rpcUrl = RPC_URL.CELO;
  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const celo = new ethers.providers.JsonRpcProvider(rpcUrl);
  const result = await celo.sendTransaction(serializedTx);
  return result;
};
