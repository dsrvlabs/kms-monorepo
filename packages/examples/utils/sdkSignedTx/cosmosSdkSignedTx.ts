/* eslint-disable no-unused-vars */
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { getCosmosAccount } from '../getAccount';
import { getCosmosPrivateKey } from '../getPrivateKey';
import { getCosmosOfflineTx } from '../getTx';

export const cosmosSdkSignedTx = async (mnemonic: string) => {
  const cosmosAccount = getCosmosAccount(mnemonic);
  const { unSignedTx } = await getCosmosOfflineTx(mnemonic);

  const privateKey = getCosmosPrivateKey(mnemonic);

  const bufferPrivateKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
  const wallet = await DirectSecp256k1Wallet.fromKey(new Uint8Array(bufferPrivateKey));
  // same
  const { signature } = await wallet.signDirect(cosmosAccount.address, unSignedTx);

  return `0x${Buffer.from(signature.signature, 'base64').toString('hex')}`;
};
