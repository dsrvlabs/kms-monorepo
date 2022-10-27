/* eslint-disable no-console */
import { getNearSignMsg, getSolanaSignMsg } from './utils/signMessage';

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;
const message = 'Hello, world!';

const main = () => {
  const nearSignMsg = getNearSignMsg(mnemonic, message);
  const solanaSignMsg = getSolanaSignMsg(mnemonic, message);

  console.log('Naer SignMsg : ', nearSignMsg);
  console.log('Solana SignMsg : ', solanaSignMsg);
};

main();
