/* eslint-disable no-unused-vars */
import { Solana } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { getSolanaOfflineTx, getSolanaTx } from '../getTx';
import { solanaSdkSignedTx } from '../sdkSignedTx';

export const getSolanaSignature = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getSolanaOfflineTx(mnemonic);
  const { signature } = Solana.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    serializedTx,
  );

  const solanaSdkSignature = await solanaSdkSignedTx(mnemonic);

  return {
    signature,
    solanaSdkSignature,
  };
};
