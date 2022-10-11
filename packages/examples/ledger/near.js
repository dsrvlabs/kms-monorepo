const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const BN = require("bn.js");
const { providers, utils, transactions } = require("near-api-js");
const { KMS, CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

const TYPE = CHAIN.NEAR;
const INDEX = 1;

/*
async function sendTransaction(signedTransaction) {
  const rpc = "https://rpc.testnet.near.org";
  const provider = new providers.JsonRpcProvider(rpc);
  const transaction = transactions.Transaction.decode(
    Buffer.from(signedTransaction.serializedTx, "base64")
  );
  const signedTx = new transactions.SignedTransaction({
    transaction,
    signature: new transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: Buffer.from(signedTransaction.signature.replace("0x", ""), "hex"),
    }),
  });

  const result = await provider.sendJsonRpc("broadcast_tx_commit", [
    Buffer.from(signedTx.encode()).toString("base64"),
  ]);
  return result;
}
*/
async function signTx(transport, type, index, account) {
  const kms = new KMS({
    keyStore: null,
    transport,
  });
  try {
    const encodedPubKey = account;
    const helperURL = `https://helper.testnet.near.org/publicKey/${account}/accounts`;
    // eslint-disable-next-line no-undef
    const accountIds = await fetch(helperURL).then((res) => res.json());
    const signerId = accountIds[Object.keys(accountIds).length - 1];
    const rpc = "https://rpc.testnet.near.org";
    const provider = new providers.JsonRpcProvider(rpc);
    const accessKey = await provider.query(
      `access_key/${signerId}/${account}`,
      ""
    );
    const nonce = accessKey.nonce + 1;
    const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);

    const actions = [transactions.transfer(new BN(10))];

    const transaction = transactions.createTransaction(
      signerId,
      utils.PublicKey.fromString(encodedPubKey),
      signerId,
      nonce,
      actions,
      recentBlockHash
    );

    const bytes = transaction.encode();

    // console.log("decode - ", transactions.Transaction.decode(bytes));

    const response = await kms.signTx(
      {
        type,
        account: 0,
        index,
      },
      {
        serializedTx: Buffer.from(bytes).toString("base64"),
      }
    );

    // eslint-disable-next-line no-console
    console.log("Transation signed - ", response);

    /*
    console.log(
      "decode - ",
      transactions.SignedTransaction.decode(
        Buffer.from(response.signedTx.replace("0x", ""), "hex")
      )
    );
    */

    // SEND TRANSACTION
    // const txResponse = await sendTransaction(response.signedTx);
    // eslint-disable-next-line no-console
    // console.log("Transaction sent - ", txResponse.transaction);
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
