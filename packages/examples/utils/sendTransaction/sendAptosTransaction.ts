import { BCS } from 'aptos';
import { RPC_URL } from '../../constants';

export const sendAptosTransaction = async (signedTx) => {
  const rpcUrl = RPC_URL.APTOS;
  // eslint-disable-next-line no-undef
  const resp = await fetch(`${rpcUrl}/transactions`, {
    method: 'POST',
    headers: {
      // https://github.com/aptos-labs/aptos-core/blob/e7d5f952afe3afcf5d1415b67e167df6d49019bf/ecosystem/typescript/sdk/src/aptos_client.ts#L327
      'Content-Type': 'application/x.aptos.signed_transaction+bcs',
    },
    body: BCS.bcsToBytes(signedTx),
  });

  const result = await resp.json();

  return result;
};
