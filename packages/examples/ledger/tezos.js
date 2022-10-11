const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;

const { CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

const TYPE = CHAIN.TEZOS;
const INDEX = 0;

async function run() {
  const transport = await TransportNodeHid.create(1000);
  const account = await getAccount(transport, TYPE, INDEX);
  // await signTx(transport, TYPE, INDEX, account.address);
  transport.close();
}

run();
