import { Keypair } from '@solana/web3.js';
import { base58 } from 'ethers/lib/utils';
import { getSolanaPrivateKey } from '../getPrivateKey';
import { getSolanaTx } from '../getTx';

export const solanaSdkSignedTx = async (mnemonic: string) => {
  const privateKey = getSolanaPrivateKey(mnemonic);
  const { unSignedTx } = await getSolanaTx(mnemonic);

  const keyPair = Keypair.fromSecretKey(base58.decode(privateKey));
  unSignedTx.sign(keyPair);
  // const signedTxSignature = unSignedTx.signature;

  return unSignedTx.serialize().toString('hex');
};
