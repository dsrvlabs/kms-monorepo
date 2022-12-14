/* eslint-disable no-unused-vars */

import { CHAIN, Near } from '@dsrv/kms';
import { getNearOfflineTx } from '../getTx';
import { nearSdkSignedTx } from '../sdkSignedTx';

export const getNearSignature = async (mnemonic: string) => {
  const { serializedTx } = await getNearOfflineTx(mnemonic);

  const { signature } = Near.signTx(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 1 },
    },
    serializedTx,
  );

  const nearSdkSignature = await nearSdkSignedTx(mnemonic);

  return {
    signature,
    nearSdkSignature,
  };
};
