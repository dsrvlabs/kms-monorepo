/* eslint-disable no-console */
import {
  getAptosPrivateKey,
  getCeloPrivateKey,
  getCosmosPrivateKey,
  getEth2PrivateKeySign,
  getEth2PrivateKeyWithdrawal,
  getEthereumPrivateKey,
  getNearPrivateKey,
  getSolanaPrivateKey,
  getSuiPrivateKey,
  getTonPrivateKey,
} from './utils/getPrivateKey';

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;

const main = () => {
  const aptosPrivateKey = getAptosPrivateKey(mnemonic);
  const cosmosPrivateKey = getCosmosPrivateKey(mnemonic);
  const ethereumPrivateKey = getEthereumPrivateKey(mnemonic);
  const eth2PrivateKeyWithdrawal = getEth2PrivateKeyWithdrawal(mnemonic);
  const eth2PrivateKeySign = getEth2PrivateKeySign(mnemonic);
  const celoPrivateKey = getCeloPrivateKey(mnemonic);
  const nearPrivateKey = getNearPrivateKey(mnemonic);
  const solanaPrivateKey = getSolanaPrivateKey(mnemonic);
  const suiPrivateKey = getSuiPrivateKey(mnemonic);
  const tonPrivateKey = getTonPrivateKey(mnemonic);

  console.log('aptosPrivateKey', aptosPrivateKey);
  console.log('cosmosPrivateKey', cosmosPrivateKey);
  console.log('ethereumPrivateKey', ethereumPrivateKey);
  console.log('eth2PrivateKeyWithdrawal', eth2PrivateKeyWithdrawal);
  console.log('eth2PrivateKeySign', eth2PrivateKeySign);
  console.log('celoPrivateKey', celoPrivateKey);
  console.log('nearPrivateKey', nearPrivateKey);
  console.log('solanaPrivateKey', solanaPrivateKey);
  console.log('suiPrivateKey', suiPrivateKey);
  console.log('tonPrivateKey', tonPrivateKey);
};

main();
