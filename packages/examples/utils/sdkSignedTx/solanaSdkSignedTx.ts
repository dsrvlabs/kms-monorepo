import { Keypair } from '@solana/web3.js';
import { getSolanaPrivateKey } from '../getPrivateKey';
import { getSolanaOfflineTx } from '../getTx';

export const solanaSdkSignedTx = async (mnemonic: string) => {
  const privateKey = getSolanaPrivateKey(mnemonic);
  const transaction = await getSolanaOfflineTx(mnemonic);

  const keyPair = Keypair.fromSecretKey(Buffer.from(privateKey.replace('0x', ''), 'hex'));

  transaction.unSignedTx.sign(keyPair);
  const signedTxSignature = transaction.unSignedTx.signature;

  return `0x${signedTxSignature.toString('hex')}`;
};
