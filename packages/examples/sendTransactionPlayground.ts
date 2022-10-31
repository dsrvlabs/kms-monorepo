/* eslint-disable no-console */
import {
  sendAptosTransaction,
  sendCeloTransaction,
  sendCosmosTransaction,
  sendEthereumTransaction,
  sendNearTransaction,
  sendSolanaTransaction,
} from './utils';
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
  /* ethereum sendtransaction */
  const { ethereumSignedTx } = await getEthereumSignedTx(mnemonic);
  console.log('>ethSignedTx', ethereumSignedTx);
  const ethereumTxResult = await sendEthereumTransaction(ethereumSignedTx);
  console.log('Ethereum TxHash : ', ethereumTxResult);

  /* celo sendtransaction */
  const { celoSignedTx } = await getCeloSignedTx(mnemonic);
  console.log('>celoSignedTx', celoSignedTx);
  const celoTxResult = await sendCeloTransaction(celoSignedTx);
  console.log('Celo TxHash : ', celoTxResult);

  /* near sendtransaction */
  const { nearSignedTx } = await getNearSignedTx(mnemonic);
  console.log('>nearSignedTx', nearSignedTx);
  const nearTxResult = await sendNearTransaction(nearSignedTx);
  console.log('Near TxHash : ', nearTxResult);

  /* cosmos sendtransaction */
  const { cosmosSignedTx } = await getCosmosSignedTx(mnemonic);
  console.log('>cosmosSignedTx', cosmosSignedTx);
  const cosmosTxResult = await sendCosmosTransaction(cosmosSignedTx);
  console.log('Cosmos TxHash', cosmosTxResult);

  /* solana sendtransaction */
  const { solanaSignedTx } = await getSolanaSignedTx(mnemonic);
  console.log('>solanaSignedTx', solanaSignedTx);
  const solanaTxResult = await sendSolanaTransaction(solanaSignedTx);
  console.log('Solana TxHash', solanaTxResult);

  /* aptos sendtransaction */
  const { aptosSignedTx } = await getAptosSignedTx(mnemonic);
  console.log('>aptosSignedTx', aptosSignedTx);
  const aptosTxResult = await sendAptosTransaction(aptosSignedTx);
  console.log('Aptos TxHash', aptosTxResult);
};
main();
