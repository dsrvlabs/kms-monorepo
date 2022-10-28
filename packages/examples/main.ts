/* eslint-disable no-unused-vars */
import { Near } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';

import { getNearAccount, getNearTx } from './utils';
import { nearSdkSignedTx } from './utils/sdkSignedTx';

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;

const main = async () => {
  const nearAccount = getNearAccount(mnemonic);
  const { serializedTx, unSignedTx } = await getNearTx(nearAccount);
  console.log('serializedTx', serializedTx);
  const { signature } = Near.signTx(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 1 },
    },
    serializedTx,
  );
  const nearSdkSignature = await nearSdkSignedTx(mnemonic, unSignedTx);
  console.log('kms sig', signature);
  console.log('nearSdkSignSignature', nearSdkSignature);
};

main();
