const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const { StargateClient } = require("@cosmjs/stargate");
const { KMS, CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

const TYPE = CHAIN.COSMOS;
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
              denom: "uatom",
              amount: "10000",
            },
          ],
          gas: "180000",
        },
        memo: "",
        msgs: [
          {
            type: "cosmos-sdk/MsgSend", // Check

            value: {
              amount: [
                {
                  denom: "uatom",
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
  const rpcUrl = "https://rpc.cosmos.network";

  const transport = await TransportNodeHid.create(1000);

  const account = await getAccount(transport, TYPE, INDEX);

  const client = await StargateClient.connect(rpcUrl);

  const sequence = await client.getSequence(account.address);

  const balance = await client.getAllBalances(account.address);
  // eslint-disable-next-line no-console
  console.log(balance);

  const chainId = await client.getChainId();
  const { signedTx } = await signTx(
    transport,
    TYPE,
    INDEX,
    account,
    sequence.accountNumber,
    sequence.sequence,
    chainId
  );

  const testing = await client.broadcastTx(
    Uint8Array.from(Buffer.from(signedTx.serializedTx.replace("0x", ""), "hex"))
  );
  // eslint-disable-next-line no-console
  console.log(testing);

  transport.close();
}

run();
