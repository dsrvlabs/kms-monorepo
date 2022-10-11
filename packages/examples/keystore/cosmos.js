const { StargateClient } = require("@cosmjs/stargate");
const { KMS, CHAIN } = require("../../lib");

const { createKeyStore, getAccount } = require("./_getAccount");

const MNEMONIC = require("../mnemonic.json");

const TYPE = CHAIN.COSMOS;
const INDEX = 0;

// eslint-disable-next-line consistent-return
async function signTx(
  path,
  keyStore,
  password,
  account,
  accountNumber,
  sequence,
  chainId
) {
  const kms = new KMS({
    keyStore,
    transport: null,
  });

  try {
    const response = await kms.signTx(
      { ...path, password },
      JSON.stringify({
        signerData: {
          accountNumber: `${accountNumber}`,
          sequence,
          chainId,
        },
        // { amount: [{ amount: "5000", denom: "uatom" }], gas: "200000" },
        fee: {
          amount: [
            {
              denom: "uatom",
              amount: "10000",
            },
          ],
          gas: "180000", // 180k
        },
        memo: "",
        msgs: [
          {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: {
              fromAddress: account,
              toAddress: account,
              amount: [{ denom: "uatom", amount: "10000" }],
            },
          },
        ],
        sequence: `${sequence}`,
      })
    );
    // eslint-disable-next-line no-console
    console.log("response - ", response);
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function run() {
  const rpcUrl = "https://rpc.cosmos.network";

  const PASSWORD = MNEMONIC.password;
  const keyStore = await createKeyStore(PASSWORD);
  const account = await getAccount(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD
  );

  const client = await StargateClient.connect(rpcUrl);

  const sequence = await client.getSequence(account.address);

  const chainId = await client.getChainId();

  // testing call balances for address
  const balance = await client.getAllBalances(account.address);
  // eslint-disable-next-line no-console
  console.log(balance);

  // signing and broadcast tx
  const { serializedTx } = await signTx(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD,
    account.address,
    sequence.accountNumber,
    sequence.sequence,
    chainId
  );
  /*
  const testing = await client.broadcastTx(
    Uint8Array.from(Buffer.from(signedTx.serializedTx.replace("0x", ""), "hex"))
  );
  // eslint-disable-next-line no-console
  console.log(testing);
  */
}

run();
