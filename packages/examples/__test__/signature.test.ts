/* eslint-disable no-undef */
import { cosmosSdkSignedTx, ethereumSdkSignedTx } from '../utils/sdkSignedTx';
import { getCosmosSignedTx, getEthereumSignedTx } from '../utils';
import { getNearSignature } from '../utils/signatureTest/getNearSignature';
import { getSolanaSignature } from '../utils/signatureTest/getSolanaSignature';
import { getAptosSignature } from '../utils/signatureTest';
import { getCeloSignature } from '../utils/signatureTest/getCeloSignature';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';

test('ethereum - signature test', async () => {
  const ethereumSdkSignature = await ethereumSdkSignedTx(mnemonic);
  const { signature } = await getEthereumSignedTx(mnemonic);
  expect(signature?.slice(0, 128)).toEqual(ethereumSdkSignature?.slice(0, 128));
});

test('celo - signature test', async () => {
  const { celoSdkSignature, signature } = await getCeloSignature();
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
