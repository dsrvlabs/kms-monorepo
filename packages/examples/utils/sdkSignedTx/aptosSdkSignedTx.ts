import { CHAIN } from '@dsrv/kms';
import { AptosAccount } from 'aptos';
import { getAptosTx } from '../getTx';

export const aptosSdkSignedTx = async (mnemonic: string, serializedTx?: string) => {
  const account = AptosAccount.fromDerivePath(`m/44'/${CHAIN.APTOS}'/0'/0'/0'`, mnemonic);

  const transaction = serializedTx ? { serializedTx } : await getAptosTx(mnemonic);
  const signature = account.signHexString(transaction.serializedTx);
  return signature;
};
