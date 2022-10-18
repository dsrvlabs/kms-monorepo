/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;
const message = 'Hello, world!';

/* Near - signMsg */
const getNearSignMsg = () => {
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
const getSolanaSignMsg = () => {
  const solanaSignMsg = Solana.signMsg(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    message,
  );
  return solanaSignMsg;
};

const main = () => {
  const nearSignMsg = getNearSignMsg();
  const solanaSignMsg = getSolanaSignMsg();

  console.log('Naer SignMsg : ', nearSignMsg);
  console.log('Solana SignMsg : ', solanaSignMsg);
};

main();
