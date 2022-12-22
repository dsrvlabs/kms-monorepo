/* eslint-disable no-undef */
import { getEthereumSignMsg } from '../utils';
import { ethereumSdkSignedMsg } from '../utils/sdkSignedMsg';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
const message = 'Hello, world!';

test('ethereum - signature test', async () => {
  const sdkSignedMsg = ethereumSdkSignedMsg(mnemonic, message);
  const kmsSignedMsg = getEthereumSignMsg(mnemonic, message);
  expect(sdkSignedMsg).toEqual(kmsSignedMsg);
});
