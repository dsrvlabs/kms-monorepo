/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { cosmosSdkSignedTx, solanaSdkSignedTx } from './utils/sdkSignedTx';
import { aptosSdkSignedTx } from './utils/sdkSignedTx/aptosSdkSignedTx';
import { celoSdkSignedTx } from './utils/sdkSignedTx/celoSdkSignedTx';
import { ethereumSdkSignedTx } from './utils/sdkSignedTx/ethereumSdkSignedTx';
import { nearSdkSignedTx } from './utils/sdkSignedTx/nearSdkSignedTx';

const MNEMONIC = require('./mnemonic.json');

const main = async () => {
  const mnemonic = MNEMONIC.bip44;
  const ethereumSingedTx = await ethereumSdkSignedTx(mnemonic);
  console.log('[By SDK] Ethereum Tx : ', ethereumSingedTx);

  const celoSignedTx = await celoSdkSignedTx(mnemonic);
  console.log('[By SDK] Celo Tx : ', celoSignedTx);

  const nearSignedTx = await nearSdkSignedTx(mnemonic);
  console.log('[By SDK] Near Tx : ', nearSignedTx);

  const cosmosSignedTx = await cosmosSdkSignedTx(mnemonic);
  console.log('[By SDK] Cosmos Tx : ', cosmosSignedTx);

  const solanaSignedTx = await solanaSdkSignedTx(mnemonic);
  console.log('[By SDK] Solana Tx : ', solanaSignedTx);

  const aptosSignedTx = await aptosSdkSignedTx(mnemonic);
  console.log('[By SDK] aptos Tx : ', aptosSignedTx);
};

main();
