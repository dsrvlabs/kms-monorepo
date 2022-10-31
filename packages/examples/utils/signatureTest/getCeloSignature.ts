import { Ethereum } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { getCeloOfflineTx } from '../getTx';
import { celoSdkSignedTx } from '../sdkSignedTx';

export const getCeloSignature = async (mnemonic: string) => {
  const celoSdkSignature = await celoSdkSignedTx(mnemonic);
  const { serializedTx } = await getCeloOfflineTx(mnemonic);
  const celoSignature = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.CELO, account: 0, index: 0 },
    },
    serializedTx,
  );
  return {
    celoSdkSignature,
    signature: celoSignature.signature,
  };
};
