import { TxnBuilderTypes, BCS } from 'aptos';
import { RPC_URL } from '../../constants';

export const sendAptosTransaction = async (serializedTx, signature, hash, publicKey) => {
  const rpcUrl = RPC_URL.APTOS;
  if (!serializedTx) {
    return { error: 'transaction error' };
  }

  if (!signature) {
    return { error: 'signature error' };
  }

  if (!publicKey) {
    return { error: 'public key error' };
  }

  const rawTxn = TxnBuilderTypes.RawTransaction.deserialize(
    new BCS.Deserializer(Buffer.from(serializedTx.replace('0x', '').slice(64), 'hex')),
  );

  const signed = new TxnBuilderTypes.SignedTransaction(
    rawTxn,
    new TxnBuilderTypes.TransactionAuthenticatorEd25519(
      new TxnBuilderTypes.Ed25519PublicKey(Buffer.from(publicKey.replace('0x', ''), 'hex')),
      new TxnBuilderTypes.Ed25519Signature(Buffer.from(signature.replace('0x', ''), 'hex')),
    ),
  );

  // eslint-disable-next-line no-undef
  const resp = await fetch(`${rpcUrl}/transactions`, {
    method: 'POST',
    headers: {
      // https://github.com/aptos-labs/aptos-core/blob/e7d5f952afe3afcf5d1415b67e167df6d49019bf/ecosystem/typescript/sdk/src/aptos_client.ts#L327
      'Content-Type': 'application/x.aptos.signed_transaction+bcs',
    },
    body: BCS.bcsToBytes(signed),
  });

  await resp.json();

  return { hash };
};
