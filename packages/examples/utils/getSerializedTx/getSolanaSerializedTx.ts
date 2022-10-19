/* eslint-disable no-console */
import { Account } from '@dsrv/kms/src/types';
import { RPC_URL, RECEIVER_ADDRESS } from '../../constants';

const {
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
} = require('@solana/web3.js');

export const getSolanaSerializedTx = async (account: Account) => {
  const RPC = RPC_URL.SOLANA;
  const CONNECTION = new Connection(RPC, 'confirmed');
  const FROMACCOUNTPUBKEY = new PublicKey(account.address);
  const TOACCOUNTPUBKEY = new PublicKey(RECEIVER_ADDRESS.SOLANA);
  const RECENTBLOCKHASH = await CONNECTION.getLatestBlockhash();

  const transaction = new Transaction({
    recentBlockhash: RECENTBLOCKHASH.blockhash,
    feePayer: FROMACCOUNTPUBKEY,
  });
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: FROMACCOUNTPUBKEY,
      lamports: Number(0.1) * LAMPORTS_PER_SOL,
      toPubkey: TOACCOUNTPUBKEY,
    }),
  );

  console.log('solana', transaction.serialize({ verifySignatures: false }).toString('hex'));
  return transaction.serialize({ verifySignatures: false }).toString('hex');
};
