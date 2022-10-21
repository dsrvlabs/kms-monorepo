import { StargateClient } from '@cosmjs/stargate';

import { RPC_URL } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const sendCosmosTransaction = async (serializedTx, hash) => {
  const rpcUrl = RPC_URL.COSMOS;
  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const client = await StargateClient.connect(rpcUrl);
  await client.broadcastTx(Uint8Array.from(Buffer.from(serializedTx.replace('0x', ''), 'hex')));
  return { hash };
};
