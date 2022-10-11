const { TxRaw } = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const { StargateClient } = require("@cosmjs/stargate");
const { KMS, CHAIN } = require("../../lib");

const { createKeyStore, getAccount } = require("./_getAccount");

const MNEMONIC = require("../mnemonic.json");

const TYPE = CHAIN.TERRA;
const INDEX = 0;

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
      {
        signerData: {
          accountNumber: `${accountNumber}`,
          sequence,
          chainId,
        },
        // { amount: [{ amount: "5000", denom: "uatom" }], gas: "200000" },
        fee: {
          amount: [
            {
              denom: "uluna", // can select ust, krt, etc...
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
              amount: [{ denom: "uluna", amount: "10000" }],
            },
          },
        ],
        sequence: `${sequence}`,
      }
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
  const rpcUrl = "https://terra-rpc.easy2stake.com";

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
  const { signedTx } = await signTx(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD,
    account.address,
    sequence.accountNumber,
    sequence.sequence,
    chainId
  );
  const txBytes = TxRaw.encode(signedTx.serializedTx).finish();
  const testing = await client.broadcastTx(txBytes);
  // eslint-disable-next-line no-console
  console.log(testing);
}

run();
