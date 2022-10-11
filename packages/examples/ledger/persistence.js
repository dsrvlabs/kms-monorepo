const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const { StargateClient } = require("@cosmjs/stargate");
const { TxRaw } = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const { KMS, CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

const TYPE = CHAIN.PERSISTENCE;
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
              denom: "uxprt",
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
                  denom: "uxprt",
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
  const rpcUrl = "https://rpc.core.persistence.one";

  const transport = await TransportNodeHid.create(1000);

  const account = await getAccount(transport, TYPE, INDEX);

  const client = await StargateClient.connect(rpcUrl);

  const sequence = await client.getSequence(account.address);

  const balance = await client.getAllBalances(account.address);
  // eslint-disable-next-line no-console
  console.log(balance);

  const chainId = await client.getChainId();
  const signing = await signTx(
    transport,
    TYPE,
    INDEX,
    account,
    sequence.accountNumber,
    sequence.sequence,
    chainId
  );

  const txRawCall = signing.signedTx.txRaw;

  const txBytes = TxRaw.encode(txRawCall).finish();
  const broadCast = await client.broadcastTx(txBytes);
  // eslint-disable-next-line no-console
  console.log(broadCast);
  transport.close();
}

run();
