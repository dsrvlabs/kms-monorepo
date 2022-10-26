import { StargateClient } from '@cosmjs/stargate';

import { RPC_URL } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const sendCosmosTransaction = async (serializedTx) => {
  const rpcUrl = RPC_URL.COSMOS;
  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  console.log('serializedTx', serializedTx);
  const client = await StargateClient.connect(rpcUrl);
  const txResult = await client.broadcastTx(
    // serializedTx,
    Uint8Array.from(Buffer.from(serializedTx.replace('0x', ''), 'hex')),
  );
  console.log('txResult', txResult);
  return txResult;
};
