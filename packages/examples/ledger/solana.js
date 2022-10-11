const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;

const {
  // Authorized,
  Connection,
  // StakeProgram,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  // sendAndConfirmRawTransaction,
} = require("@solana/web3.js");

const { KMS, CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

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
async function signTx(transport, type, index, account) {
  const kms = new KMS({
    keyStore: null,
    transport,
  });
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

    const response = await kms.signTx(
      {
        type,
        account: 0,
        index,
      },
      {
        serializedTx: transaction
          .serialize({ verifySignatures: false })
          .toString("hex"),
      }
    );
    // eslint-disable-next-line no-console
    console.log("response - ", response);
    // Send Transaction
    // sendTransation(CONNECTION, ACCOUNTPUBKEY, response.signedTx);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function run() {
  const transport = await TransportNodeHid.create(1000);
  const account = await getAccount(transport, TYPE, INDEX);
  await signTx(transport, TYPE, INDEX, account.address);
  transport.close();
}

run();
