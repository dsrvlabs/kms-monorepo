import { providers, transactions } from 'near-api-js';
import { RPC_URL } from '../../constants';

export const sendNearTransaction = async (serializedTx, signature, hash) => {
  const rpcUrl = RPC_URL.NEAR;

  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  if (!signature) {
    return { error: 'signature error' };
  }

  const provider = new providers.JsonRpcProvider({ url: rpcUrl });
  const transaction = transactions.Transaction.decode(Buffer.from(serializedTx, 'base64'));

  const temp = new transactions.SignedTransaction({
    transaction,
    signature: new transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: Buffer.from(signature.replace('0x', ''), 'hex'),
    }),
  });

  await provider.sendJsonRpc('broadcast_tx_commit', [
    Buffer.from(temp.encode()).toString('base64'),
  ]);
  return { hash };
};
