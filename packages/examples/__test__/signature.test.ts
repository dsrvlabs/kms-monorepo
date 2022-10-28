/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { createKeyStore, getMnemonic } from '@dsrv/kms/src/argon2';
import { CHAIN } from '@dsrv/kms/src/types';
import { Aptos } from '@dsrv/kms/src/blockchains/aptos';
import { Cosmos } from '@dsrv/kms/src/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/src/blockchains/ethereum';
import { Eth2 } from '@dsrv/kms/src/blockchains/eth2';
import { Near } from '@dsrv/kms/src/blockchains/near';
import { Solana } from '@dsrv/kms/src/blockchains/solana';
import { Sui } from '@dsrv/kms/src/blockchains/sui';
import {
  celoSdkSignedTx,
  cosmosSdkSignedTx,
  ethereumSdkSignedTx,
  nearSdkSignedTx,
} from '../utils/sdkSignedTx';
import {
  getCeloSignedTx,
  getCosmosSignedTx,
  getEthereumSignedTx,
  getNearAccount,
  getNearSignedTx,
  getNearTx,
} from '../utils';
import { getNearSignature } from '../utils/signatureTest/getNearSignature';
import { getSolanaSignature } from '../utils/signatureTest/getSolanaSignature';

// const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
const MNEMONIC = require('../mnemonic.json');

const mnemonic = MNEMONIC.bip44;
const { password } = MNEMONIC;

test('ethereum - signature test', async () => {
  const ethereumSdkSignature = await ethereumSdkSignedTx(mnemonic);
  const { signature } = await getEthereumSignedTx(mnemonic);
  expect(signature.slice(0, 128)).toEqual(ethereumSdkSignature.slice(0, 128));
});

test('celo - signature test', async () => {
  const celoSdkSignature = await celoSdkSignedTx(mnemonic);
  const { signature } = await getCeloSignedTx(mnemonic);
  expect(signature.slice(0, 128)).toEqual(celoSdkSignature.slice(0, 128));
});
test('Cosmos - signature test', async () => {
  const cosmosSdkSignature = await cosmosSdkSignedTx(mnemonic);
  const { signature } = await getCosmosSignedTx(mnemonic);
  expect(signature).toEqual(cosmosSdkSignature.signature);
});

test('near - signature test', async () => {
  const { signature, nearSdkSignature } = await getNearSignature();

  expect(signature).toEqual(nearSdkSignature);
});

test('solana - signature test', async () => {
  const { signature, solanaSdkSignature } = await getSolanaSignature();

  expect(signature).toEqual(solanaSdkSignature);
});

// test('aptos - signature test', async () => {
//   const { signature, nearSdkSignature } = await getNearSignature();

//   expect(signature).toEqual(nearSdkSignature);
// });
