import { Transaction } from '@solana/web3.js';

import { RPC_URL } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const sendSolanaTransaction = async (serializedTx, signature, hash) => {
  const rpcUrl = RPC_URL.SOLANA;

  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  const transaction = Transaction.from(Buffer.from(serializedTx.replace('0x', ''), 'hex'));

  if (!transaction.feePayer) {
    return { error: 'account error' };
  }

  if (!signature) {
    return { error: 'signature error' };
  }

  transaction.addSignature(transaction.feePayer, Buffer.from(signature.replace('0x', ''), 'hex'));

  await fetch(rpcUrl, {
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

  return { hash };
};
