/* eslint-disable no-unused-vars */

import { CHAIN, Ton } from '@dsrv/kms';
import { getTonTx } from '../getTx';
import { tonSdkSignedTx } from '../sdkSignedTx';

export const getTonSignature = async (mnemonic: string) => {
  const { serializedTx } = await getTonTx(mnemonic);

  const { signature } = Ton.signTx(
    {
      mnemonic,
      path: { type: CHAIN.TON, account: 0, index: 0 },
    },
    serializedTx,
  );

  const tonSdkSignature = await tonSdkSignedTx(mnemonic);

  return {
    signature,
    tonSdkSignature,
  };
};
