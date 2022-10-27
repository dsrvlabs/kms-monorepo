import { CHAIN } from '@dsrv/kms/src/types';
import { AptosAccount } from 'aptos';
import { getAptosTx } from '../getTx';

export const aptosSdkSignedTx = async (mnemonic: string) => {
  const account = AptosAccount.fromDerivePath(`m/44'/${CHAIN.APTOS}'/0'/0'/0'`, mnemonic);
  const { serializedTx } = await getAptosTx(mnemonic);
  const signature = account.signHexString(serializedTx);
  return signature;
};
