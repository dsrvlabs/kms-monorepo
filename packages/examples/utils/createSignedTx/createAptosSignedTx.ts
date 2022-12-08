import { TxnBuilderTypes, BCS } from 'aptos';
import { getAptosAccount } from '../getAccount';

interface createAptosSignedTxProps {
  serializedTx: string;
  signature: string;
  mnemonic: string;
}
export const createAptosSignedTx = ({
  serializedTx,
  signature,
  mnemonic,
}: createAptosSignedTxProps) => {
  const accounts = getAptosAccount(mnemonic);
  const rawTxn = TxnBuilderTypes.RawTransaction.deserialize(
    new BCS.Deserializer(Buffer.from(serializedTx.replace('0x', '').slice(64), 'hex')),
  );

  const signed = new TxnBuilderTypes.SignedTransaction(
    rawTxn,
    new TxnBuilderTypes.TransactionAuthenticatorEd25519(
      new TxnBuilderTypes.Ed25519PublicKey(
        Buffer.from(accounts.publicKey.replace('0x', ''), 'hex'),
      ),
      new TxnBuilderTypes.Ed25519Signature(Buffer.from(signature.replace('0x', ''), 'hex')),
    ),
  );

  return signed as TxnBuilderTypes.SignedTransaction;
};
