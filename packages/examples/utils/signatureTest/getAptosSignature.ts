import { Aptos } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { getAptosTx } from '../getTx';
import { aptosSdkSignedTx } from '../sdkSignedTx/aptosSdkSignedTx';

export const getAptosSignature = async (mnemonic: string) => {
  const { serializedTx } = await getAptosTx(mnemonic);
  const { signature } = Aptos.signTx(
    {
      mnemonic,
      path: { type: CHAIN.APTOS, account: 0, index: 0 },
    },
    serializedTx,
  );

  const aptosSdkSignature = await aptosSdkSignedTx(mnemonic, serializedTx);

  return {
    signature,
    aptosSdkSignature,
  };
};
