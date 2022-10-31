import { providers } from 'near-api-js';
import { RPC_URL } from '../../constants';

export const sendNearTransaction = async (serializedTx: string) => {
  const rpcUrl = RPC_URL.NEAR;

  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const provider = new providers.JsonRpcProvider({ url: rpcUrl });

  const txResult = await provider.sendJsonRpc('broadcast_tx_commit', [serializedTx]);
  return txResult;
};
