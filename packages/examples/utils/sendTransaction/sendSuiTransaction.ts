import { SUI_RPC } from '../getTx';

async function request(method, params) {
  const res = await fetch(SUI_RPC, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 0,
      jsonrpc: '2.0',
      method,
      params: params || [],
    }),
  });

  const { result } = await res.json();
  return result;
}

export const sendSuiTransaction = async (suiSignedTx) => {
  const result = await request('sui_executeTransactionBlock', suiSignedTx);
  return result;
};
