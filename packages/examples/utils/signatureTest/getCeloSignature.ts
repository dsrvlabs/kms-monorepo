import { celoSdkSignedTx } from '../sdkSignedTx';
import { getCeloSignedTx } from '../signTx';

const MNEMONIC = require('../../mnemonic.json');

const mnemonic = MNEMONIC.bip44;

export const getCeloSignature = async () => {
  const celoSdkSignature = await celoSdkSignedTx(mnemonic);
  const { signature } = await getCeloSignedTx(mnemonic);
  return {
    celoSdkSignature,
    signature,
  };
};
