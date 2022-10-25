/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { ethers } from 'ethers';
import { sendCeloTransaction, sendEthereumTransaction, sendNearTransaction } from './utils';
import { stringToHex } from './utils/common';
import {
  getAptosSignedTx,
  getCosmosSignedTx,
  getEthereumSignedTx,
  getCeloSignedTx,
  getNearSignedTx,
  getSolanaSignedTx,
} from './utils/signTx';

const MNEMONIC = require('./mnemonic.json');

const main = async () => {
  const mnemonic = MNEMONIC.bip44;
  // /* ethereum sendtransaction */
  // const ethereumSignedTx = await getEthereumSignedTx(mnemonic);
  // console.log('>ethSignedTx', ethereumSignedTx);
  // const ethereumTxResult = await sendEthereumTransaction(ethereumSignedTx);
  // console.log('Ethereum TxHash : ', ethereumTxResult);

  // /* celo sendtransaction */
  // const celoSignedTx = await getCeloSignedTx(mnemonic);
  // console.log('>celoSignedTx', celoSignedTx);
  // const celoTxResult = await sendCeloTransaction(celoSignedTx);
  // console.log('Celo TxHash : ', celoTxResult);

  /* near sendtransaction */
  const nearSignedTx = await getNearSignedTx(mnemonic);
  console.log('>nearSignedTx', nearSignedTx);
  const nearTxResult = await sendNearTransaction(nearSignedTx);
  console.log('Near TxHash : ', nearTxResult);
};
main();
