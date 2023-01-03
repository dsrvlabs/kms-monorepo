/* eslint-disable no-console */
import {
  getAptosAccount,
  getCosmosAccount,
  getEthereumAccount,
  getEth2AccountWithdrawal,
  getEth2AccountSign,
  getNearAccount,
  getSolanaAccount,
  getSuiAccount,
  getCeloAccount,
  getTonAccount,
} from './utils/getAccount';

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;

const main = () => {
  const aptosAccount = getAptosAccount(mnemonic);
  const cosmosAccount = getCosmosAccount(mnemonic);
  const ethereumAccount = getEthereumAccount(mnemonic);
  const eth2AccountWithdrawal = getEth2AccountWithdrawal(mnemonic);
  const eth2AccountSign = getEth2AccountSign(mnemonic);
  const celoAccount = getCeloAccount(mnemonic);
  const nearAccount = getNearAccount(mnemonic);
  const solanaAccount = getSolanaAccount(mnemonic);
  const suiAccount = getSuiAccount(mnemonic);
  const tonAccount = getTonAccount(mnemonic);

  console.log('aptosAccount', aptosAccount);
  console.log('cosmosAccount', cosmosAccount);
  console.log('ethereumAccount', ethereumAccount);
  console.log('eth2AccountWithdrawal', eth2AccountWithdrawal);
  console.log('eth2AccountSign', eth2AccountSign);
  console.log('celoAccount', celoAccount);
  console.log('nearAccount', nearAccount);
  console.log('solanaAccount', solanaAccount);
  console.log('suiAccount', suiAccount);
  console.log('tonAccount', tonAccount);
};

main();
