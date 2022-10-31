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
  const ethereumSignedTxSignature = await ethereumSdkSignedTx(mnemonic);
  console.log('[By SDK] Ethereum Signature : ', ethereumSignedTxSignature);

  const celoSignedTxSignature = await celoSdkSignedTx(mnemonic);
  console.log('[By SDK] Celo Signature : ', celoSignedTxSignature);

  const nearSignedTxSignature = await nearSdkSignedTx(mnemonic);
  console.log('[By SDK] Near Signature : ', nearSignedTxSignature);

  const cosmosSignedTxSignature = await cosmosSdkSignedTx(mnemonic);
  console.log('[By SDK] Cosmos Signature : ', cosmosSignedTxSignature);

  const solanaSignedTxSignature = await solanaSdkSignedTx(mnemonic);
  console.log('[By SDK] Solana Signature : ', solanaSignedTxSignature);

  const aptosSignedTxSignature = await aptosSdkSignedTx(mnemonic);
  console.log('[By SDK] aptos Signature : ', aptosSignedTxSignature);
};

main();
