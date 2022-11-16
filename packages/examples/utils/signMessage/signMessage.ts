/* eslint-disable no-console */
import { CHAIN, Near, Solana } from '@dsrv/kms';

/* Near - signMsg */
export const getNearSignMsg = (mnemonic: string, message: string) => {
  const nearSignMsg = Near.signMsg(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 0 },
    },
    message,
  );
  return nearSignMsg;
};

/* Solana - signMsg */
export const getSolanaSignMsg = (mnemonic: string, message: string) => {
  const solanaSignMsg = Solana.signMsg(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    message,
  );
  return solanaSignMsg;
};
