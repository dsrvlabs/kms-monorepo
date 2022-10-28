/* eslint-disable no-unused-vars */
import { Near } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { getNearAccount } from '../getAccount';
import { getNearTx } from '../getTx';
import { nearSdkSignedTx } from '../sdkSignedTx';

const MNEMONIC = require('../../mnemonic.json');

const mnemonic = MNEMONIC.bip44;

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
