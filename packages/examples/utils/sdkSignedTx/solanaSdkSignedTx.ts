import { Keypair, Transaction } from '@solana/web3.js';
import { base58 } from 'ethers/lib/utils';
import { getSolanaPrivateKey } from '../getPrivateKey';
import { getSolanaTx } from '../getTx';

export const solanaSdkSignedTx = async (mnemonic: string, unSignedTx?: Transaction) => {
  const privateKey = getSolanaPrivateKey(mnemonic);
  const transaction = unSignedTx ? { unSignedTx } : await getSolanaTx(mnemonic);

  const keyPair = Keypair.fromSecretKey(base58.decode(privateKey));

  transaction.unSignedTx.sign(keyPair);
  const signedTxSignature = transaction.unSignedTx.signature;

  return `0x${signedTxSignature.toString('hex')}`;
};
