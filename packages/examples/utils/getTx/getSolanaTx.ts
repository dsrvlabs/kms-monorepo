/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Solana } from '@dsrv/kms';
import { Account, CHAIN } from '@dsrv/kms/src/types';
import {
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  Keypair,
} from '@solana/web3.js';
import { base58 } from 'ethers/lib/utils';
import { RPC_URL, RECEIVER_ADDRESS } from '../../constants';
import { getSolanaPrivateKey } from '../getPrivateKey';

export const getSolanaTx = async (mnemonic: string) => {
  const RPC = RPC_URL.SOLANA;
  const CONNECTION = new Connection(RPC, 'confirmed');
  const TOACCOUNTPUBKEY = new PublicKey(RECEIVER_ADDRESS.SOLANA);
  const RECENTBLOCKHASH = await CONNECTION.getLatestBlockhash();
  const privateKey = getSolanaPrivateKey(mnemonic);
  const signer = Keypair.fromSecretKey(base58.decode(privateKey));

  const transaction = new Transaction({
    /* blockHash for test */
    // blockhash: '852CyQC94LPugTAsv8jeBqMR5WxTGpXb5hJdWBpz6pfr',
    // lastValidBlockHeight: 161918865,
    /* new blockHash */
    blockhash: RECENTBLOCKHASH.blockhash,
    lastValidBlockHeight: RECENTBLOCKHASH.lastValidBlockHeight,
    feePayer: signer.publicKey,
  });
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      lamports: Number(0.1) * LAMPORTS_PER_SOL,
      toPubkey: TOACCOUNTPUBKEY,
    }),
  );

  // const result = await sendAndConfirmTransaction(CONNECTION, transaction, [keyPair]);

  return {
    serializedTx: `0x${transaction.compileMessage().serialize().toString('hex')}`,
    unSignedTx: transaction,
  };
};
