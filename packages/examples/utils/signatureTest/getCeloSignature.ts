import { celoSdkSignedTx } from '../sdkSignedTx';
import { getCeloSignedTx } from '../signTx';

export const getCeloSignature = async (mnemonic: string) => {
  const celoSdkSignature = await celoSdkSignedTx(mnemonic);
  const { signature } = await getCeloSignedTx(mnemonic);
  return {
    celoSdkSignature,
    signature,
  };
};
