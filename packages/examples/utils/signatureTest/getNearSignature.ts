/* eslint-disable no-unused-vars */

import { CHAIN, Near } from '@dsrv/kms/lib/blockchains/near';
import { getNearAccount } from '../getAccount';
import { getNearTx } from '../getTx';
import { nearSdkSignedTx } from '../sdkSignedTx';

const MNEMONIC = require('../../mnemonic.json');

const mnemonic = MNEMONIC.bip44;
// const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';

export const getNearSignature = async () => {
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
