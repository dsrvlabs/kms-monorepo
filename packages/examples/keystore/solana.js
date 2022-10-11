const {
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  // sendAndConfirmRawTransaction,
} = require("@solana/web3.js");

const {
  createKeyStore,
  getAccount,
  getMnemonic,
  CHAIN,
  signTxFromKeyStore,
  MNEMONIC,
} = require("./_getAccount");

const TYPE = CHAIN.SOLANA;
const INDEX = 0;

/*
async function getStakeAccount(stakeAccountSeed, fromPublicKey) {
  const stakePubkey = await PublicKey.createWithSeed(
    fromPublicKey,
    stakeAccountSeed,
    StakeProgram.programId
  );
  // eslint-disable-next-line no-console
  console.log("stakePubkey - ", stakePubkey.toString());
  return stakePubkey;
}
*/
/*
async function sendTransation(connection, pubKey, signedTransaction) {
  try {
    const transaction = Transaction.from(
      Buffer.from(signedTransaction.serializedTx.replace("0x", ""), "hex")
    );
    transaction.addSignature(
      pubKey,
      Buffer.from(signedTransaction.signature.replace("0x", ""), "hex")
    );

    const hash = await sendAndConfirmRawTransaction(
      connection,
      transaction.serialize(),
      {
        preflightCommitment: "confirmed",
      }
    );
    console.log(hash);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
*/
async function signTx(path, mnemonic, account) {
  try {
    const RPC = "https://api.devnet.solana.com"; // DEV NET
    const CONNECTION = new Connection(RPC, "confirmed");
    // const timeStamp = new Date().getTime();
    // const STAKEACCOUNTSEED = timeStamp.toString();
    const ACCOUNTPUBKEY = new PublicKey(account);
    // const STAKEPUBKEY = await getStakeAccount(STAKEACCOUNTSEED, ACCOUNTPUBKEY);

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
      })
    );

    const response = await signTxFromKeyStore(
      path,
      mnemonic,
      transaction.serialize({ verifySignatures: false }).toString("hex")
    );
    // eslint-disable-next-line no-console
    console.log("response - ", response);
    // Send Transaction
    // sendTransation(CONNECTION, ACCOUNTPUBKEY, response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function run() {
  const PASSWORD = MNEMONIC.password;
  const keyStore = await createKeyStore(PASSWORD);
  const mnemonic = await getMnemonic(PASSWORD, keyStore);
  const account = await getAccount(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD
  );
  await signTx(
    { type: TYPE, account: 0, index: INDEX },
    mnemonic,
    account.address
  );
}

run();
