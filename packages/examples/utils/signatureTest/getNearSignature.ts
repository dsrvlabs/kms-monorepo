/* eslint-disable no-unused-vars */

import { CHAIN, Near } from '@dsrv/kms/lib/blockchains/near';
import { getNearAccount } from '../getAccount';
import { getNearTx } from '../getTx';
import { nearSdkSignedTx } from '../sdkSignedTx';

export const getNearSignature = async (mnemonic: string) => {
  const nearAccount = getNearAccount(mnemonic);
  const { serializedTx, unSignedTx } = await getNearTx(nearAccount);

  const { signature } = Near.signTx(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 1 },
    },
    serializedTx,
  );

  const nearSdkSignature = await nearSdkSignedTx(mnemonic, unSignedTx);

  return {
    signature,
    nearSdkSignature,
  };
};
