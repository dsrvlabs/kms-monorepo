/* eslint-disable no-console */
import { ethereumSdkSignedTx } from './utils/sdkSignedTx/ethereumSdkSignedTx';

const MNEMONIC = require('./mnemonic.json');

const main = async () => {
  const mnemonic = MNEMONIC.bip44;
  const ethereumSingedTx = await ethereumSdkSignedTx(mnemonic);
  console.log('[By SDK] Ethereum Tx : ', ethereumSingedTx);
};

main();
