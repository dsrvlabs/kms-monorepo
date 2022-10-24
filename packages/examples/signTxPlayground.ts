/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
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
  // const ethereumSignedTx = await getEthereumSignedTx(mnemonic);
  // console.log('Ethereum SignedTx : ', ethereumSignedTx);

  // const celoSignedTx = await getCeloSignedTx(mnemonic);
  // console.log('Celo SignedTx : ', celoSignedTx);

  const nearSignedTx = await getNearSignedTx(mnemonic);
  console.log('Near SignedTx : ', nearSignedTx);

  // const aptosSignedTx = await getAptosSignedTx(mnemonic);
  // const cosmosSignedTx = await getCosmosSignedTx(mnemonic);
  // const ethereumSignedTx = getEthereumSignedTx(mnemonic);
  // const celoSignedTx = getCeloSignedTx(mnemonic);
  // const nearSignedTx = await getNearSignedTx(mnemonic);
  // const solanaSignedTx = await getSolanaSignedTx(mnemonic);

  // console.log('Aptos SignedTx : ', aptosSignedTx);
  // console.log('Cosmos SignedTx : ', cosmosSignedTx);
  // console.log('Ethereum SignedTx : ', ethereumSignedTx);
  // console.log('Celo SignedTx : ', celoSignedTx);
  // console.log('Near SignedTx : ', nearSignedTx);
  // console.log('Solana SignedTx : ', solanaSignedTx);
};

main();
