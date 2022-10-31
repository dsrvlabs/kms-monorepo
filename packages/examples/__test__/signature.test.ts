/* eslint-disable no-undef */
import { celoSdkSignedTx, cosmosSdkSignedTx, ethereumSdkSignedTx } from '../utils/sdkSignedTx';
import { getCeloSignedTx, getCosmosSignedTx, getEthereumSignedTx } from '../utils';
import { getNearSignature } from '../utils/signatureTest/getNearSignature';
import { getSolanaSignature } from '../utils/signatureTest/getSolanaSignature';
import { getAptosSignature } from '../utils/signatureTest';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
// const MNEMONIC = require('../mnemonic.json');

// const mnemonic = MNEMONIC.bip44;

test('ethereum - signature test', async () => {
  const ethereumSdkSignature = await ethereumSdkSignedTx(mnemonic);
  const { signature } = await getEthereumSignedTx(mnemonic);
  expect(signature?.slice(0, 128)).toEqual(ethereumSdkSignature?.slice(0, 128));
});

test('celo - signature test', async () => {
  const celoSdkSignature = await celoSdkSignedTx(mnemonic);
  const { signature } = await getCeloSignedTx(mnemonic);
  expect(signature?.slice(0, 128)).toEqual(celoSdkSignature?.slice(0, 128));
});
test('cosmos - signature test', async () => {
  const cosmosSdkSignature = await cosmosSdkSignedTx(mnemonic);
  const { signature } = await getCosmosSignedTx(mnemonic);
  expect(signature).toEqual(cosmosSdkSignature);
});

test('near - signature test', async () => {
  const { signature, nearSdkSignature } = await getNearSignature();

  expect(signature).toEqual(nearSdkSignature);
});

test('solana - signature test', async () => {
  const { signature, solanaSdkSignature } = await getSolanaSignature();

  expect(signature).toEqual(solanaSdkSignature);
});

test('aptos - signature test', async () => {
  const { signature, aptosSdkSignature } = await getAptosSignature();

  expect({ hexString: signature }).toEqual(aptosSdkSignature);
});
