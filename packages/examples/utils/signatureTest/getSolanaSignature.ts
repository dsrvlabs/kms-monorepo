/* eslint-disable no-unused-vars */
import { Solana } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { createSolanaSignedTx } from '../createSignedTx/createSolanaSignedtx';
import { getSolanaAccount } from '../getAccount';
import { getSolanaTx } from '../getTx';
import { solanaSdkSignedTx } from '../sdkSignedTx';
import { getSolanaSignedTx } from '../signTx';

const MNEMONIC = require('../../mnemonic.json');

const mnemonic = MNEMONIC.bip44;

export const getSolanaSignature = async () => {
  const { serializedTx, unSignedTx } = await getSolanaTx(mnemonic);
  const { signature } = Solana.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    serializedTx,
  );

  const solanaSdkSignature = await solanaSdkSignedTx(mnemonic, unSignedTx);

  return {
    signature,
    solanaSdkSignature,
  };
};
