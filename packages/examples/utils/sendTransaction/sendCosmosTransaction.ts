import { StargateClient, DeliverTxResponse } from '@cosmjs/stargate';

import { RPC_URL } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const sendCosmosTransaction = async (serializedTx): Promise<DeliverTxResponse> => {
  const rpcUrl = RPC_URL.COSMOS;

  const client = await StargateClient.connect(rpcUrl);
  const txResult = await client.broadcastTx(
    // serializedTx,
    Uint8Array.from(Buffer.from(serializedTx.replace('0x', ''), 'hex')),
  );
  return txResult;
};
