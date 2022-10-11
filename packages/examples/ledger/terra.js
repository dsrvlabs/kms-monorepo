const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const { StargateClient } = require("@cosmjs/stargate");
const { LCDClient } = require("@terra-money/terra.js");
const { KMS, CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

const TYPE = CHAIN.TERRA;
const INDEX = 0;

async function signTx(
  transport,
  type,
  index,
  account,
  accountNumber,
  sequence,
  chainId
) {
  const kms = new KMS({
    keyStore: null,
    transport,
  });
  try {
    const response = await kms.signTx(
      {
        type,
        account: 0,
        index,
      },
      {
        account_number: `${accountNumber}`,
        chain_id: chainId,
        fee: {
          amount: [
            {
              denom: "uluna",
              amount: "1378",
            },
          ],
          gas: "91808",
        },
        memo: "",
        msgs: [
          {
            type: "bank/MsgSend", // Check

            value: {
              amount: [
                {
                  denom: "uluna",
                  amount: "10000",
                },
              ],
              from_address: account.address,
              to_address: account.address,
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
  // const rpcUrl = "https://rpc.cosmos.network";

  const transport = await TransportNodeHid.create(1000);

  const account = await getAccount(transport, TYPE, INDEX);

  const client = await StargateClient.connect(rpcUrl);

  const sequence = await client.getSequence(account.address);

  const balance = await client.getAllBalances(account.address);
  // eslint-disable-next-line no-console
  console.log(balance);

  const chainId = await client.getChainId();

  const terra = new LCDClient({
    URL: "https://lcd.terra.dev/",
    chainID: chainId,
  });

  const { signedTx } = await signTx(
    transport,
    TYPE,
    INDEX,
    account,
    sequence.accountNumber,
    sequence.sequence,
    chainId
  );

  const broadCast = await terra.tx.broadcast(signedTx.serializedTx);
  // eslint-disable-next-line no-console
  console.log(broadCast);
  transport.close();
}

run();
