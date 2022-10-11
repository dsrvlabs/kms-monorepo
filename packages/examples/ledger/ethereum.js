// const { CeloProvider } = require("@celo-tools/celo-ethers-wrapper");

// eslint-disable-next-line import/no-extraneous-dependencies
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const { KMS, CHAIN } = require("../../lib");
const { getAccount } = require("./_getAccount");

const TYPE = CHAIN.ETHEREUM;
const INDEX = 0;

/* transaction send
async function sendTx(signedTx) {
  const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");
  const result = await provider.sendTransaction(signedTx.serializedTx);
  const temp = await result.wait();
  console.log("sendTxResult: ", temp);
}
*/

async function signTx(transport, type, index, to) {
  const kms = new KMS({
    keyStore: null,
    transport,
  });
  let response;
  try {
    response = await kms.signTx(
      {
        type,
        account: 0,
        index,
      },
      JSON.stringify({
        nonce: "0x00",
        gasPrice: "0xffffffff",
        gasLimit: "0xffffff",
        to,
        value: "0x01",
        chainId: 44787,
      })
    );
    // eslint-disable-next-line no-console
    console.log("response - ", response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return response;
}

async function run() {
  const transport = await TransportNodeHid.create(1000);
  const account = await getAccount(transport, TYPE, INDEX);
  const signedTx = await signTx(transport, TYPE, INDEX, account.address);
  // console.log(signedTx);
  // await sendTx(signedTx.signedTx);
  transport.close();
}

run();
