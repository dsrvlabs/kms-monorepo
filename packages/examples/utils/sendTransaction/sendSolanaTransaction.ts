import { Transaction } from '@solana/web3.js';

import { RPC_URL } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const sendSolanaTransaction = async (serializedTx) => {
  const rpcUrl = RPC_URL.SOLANA;

  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const transaction = Transaction.from(Buffer.from(serializedTx, 'hex'));

  if (!transaction.feePayer) {
    return { error: 'account error' };
  }

  const result = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'sendTransaction',
      params: [
        transaction.serialize().toString('base64'),
        { preflightCommitment: 'confirmed', encoding: 'base64' },
      ],
      id: 999,
    }),
  });
  const resultJson = await result.json();

  return resultJson.result;
};
