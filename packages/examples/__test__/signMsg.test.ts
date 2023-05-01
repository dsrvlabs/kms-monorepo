/* eslint-disable no-undef */
import { getEthereumSignMsg, getSuiSignMsg } from '../utils';
import { ethereumSdkSignedMsg, suiSdkSignedMsg } from '../utils/sdkSignedMsg';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
const message = 'Hello, world!';

test('ethereum - signature test', async () => {
  const sdkSignedMsg = await ethereumSdkSignedMsg(mnemonic, message);
  const kmsSignedMsg = getEthereumSignMsg(mnemonic, message);
  expect(sdkSignedMsg).toEqual(kmsSignedMsg.signature);
});

test('sui - signature test', async () => {
  const sdkSignedMsg = await suiSdkSignedMsg(mnemonic, message);
  const kmsSignedMsg = getSuiSignMsg(mnemonic, message);
  expect(sdkSignedMsg).toEqual(kmsSignedMsg.signature);
});
