import { CHAIN, Solana } from '@dsrv/kms';
import { Keypair } from '@solana/web3.js';

import { getSolanaOfflineTx } from '../getTx';

export const solanaSdkSignedTx = async (mnemonic: string) => {
  const { secretKey } = Solana.getKeyPair({
    mnemonic,
    path: {
      type: CHAIN.SOLANA,
      account: 0,
      index: 0,
    },
  });

  const transaction = await getSolanaOfflineTx(mnemonic);

  const keyPair = Keypair.fromSecretKey(secretKey);

  transaction.unSignedTx.sign(keyPair);
  const signedTxSignature = transaction.unSignedTx.signature;

  return `0x${signedTxSignature.toString('hex')}`;
};
