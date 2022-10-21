import { Transaction, providers } from 'ethers';
import { RPC_URL } from '../../constants';

type Error = {
  error: string;
};
export const sendEthereumTransaction = async (serializedTx): Promise<Transaction | Error> => {
  const rpcUrl = RPC_URL.ETHEREUM;

  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const ethereum = new providers.JsonRpcProvider(rpcUrl);

  const result = await ethereum.sendTransaction(serializedTx);
  return result;
};
