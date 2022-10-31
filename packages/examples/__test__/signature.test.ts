/* eslint-disable no-undef */
import { getNearSignature } from '../utils/signatureTest/getNearSignature';
import { getSolanaSignature } from '../utils/signatureTest/getSolanaSignature';
import { getAptosSignature } from '../utils/signatureTest';
import { getCeloSignature } from '../utils/signatureTest/getCeloSignature';
import { getCosmosSignature } from '../utils/signatureTest/getCosmosSignature';
import { getEthereumSignature } from '../utils/signatureTest/getEthereumSignature';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';

test('ethereum - signature test', async () => {
  const { ethereumSdkSignature, signature } = await getEthereumSignature(mnemonic);
  expect(signature?.slice(0, 128)).toEqual(ethereumSdkSignature?.slice(0, 128));
});

test('celo - signature test', async () => {
  const { celoSdkSignature, signature } = await getCeloSignature(mnemonic);
  expect(signature?.slice(0, 128)).toEqual(celoSdkSignature?.slice(0, 128));
});
test('cosmos - signature test', async () => {
  const { cosmosSdkSignature, signature } = await getCosmosSignature(mnemonic);
  expect(signature).toEqual(cosmosSdkSignature);
});

test('near - signature test', async () => {
  const { signature, nearSdkSignature } = await getNearSignature(mnemonic);

  expect(signature).toEqual(nearSdkSignature);
});

test('solana - signature test', async () => {
  const { signature, solanaSdkSignature } = await getSolanaSignature(mnemonic);

  expect(signature).toEqual(solanaSdkSignature);
});

test('aptos - signature test', async () => {
  const { signature, aptosSdkSignature } = await getAptosSignature(mnemonic);

  expect({ hexString: signature }).toEqual(aptosSdkSignature);
});
