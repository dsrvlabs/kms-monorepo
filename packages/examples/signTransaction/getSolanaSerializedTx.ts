/* eslint-disable no-console */
import { Account } from '@dsrv/kms/src/types';

const {
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
} = require('@solana/web3.js');

export const getSolanaSerializedTx = async (account: Account) => {
  const RPC = 'https://api.devnet.solana.com'; // DEV NET
  const CONNECTION = new Connection(RPC, 'confirmed');
  const ACCOUNTPUBKEY = new PublicKey(account.address);
  const RECENTBLOCKHASH = await CONNECTION.getLatestBlockhash();

  const transaction = new Transaction({
    recentBlockhash: RECENTBLOCKHASH.blockhash,
    feePayer: ACCOUNTPUBKEY,
  });
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: ACCOUNTPUBKEY,
      lamports: Number(0.1) * LAMPORTS_PER_SOL,
      toPubkey: ACCOUNTPUBKEY,
    }),
  );

  console.log('solana', transaction.serialize({ verifySignatures: false }).toString('hex'));
  return transaction.serialize({ verifySignatures: false }).toString('hex');
};
