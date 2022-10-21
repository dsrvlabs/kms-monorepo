import { RPC_URL } from '../../constants';

const ethers = require('ethers');

export const sendCeloTransaction = async (serializedTx, hash) => {
  const rpcUrl = RPC_URL.CELO;
  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const celo = new ethers.providers.JsonRpcProvider(rpcUrl);
  await celo.sendTransaction(serializedTx);
  return { hash };
};
