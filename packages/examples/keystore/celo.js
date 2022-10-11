const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://alfajores-forno.celo-testnet.org"
);

// const { CeloProvider } = require("@celo-tools/celo-ethers-wrapper");
// const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");

const {
  createKeyStore,
  getAccount,
  getMnemonic,
  CHAIN,
  signTxFromKeyStore,
  MNEMONIC,
} = require("./_getAccount");

const TYPE = CHAIN.CELO;
const INDEX = 0;

async function sendTx(serializedTx) {
  const recept = await provider.sendTransaction(serializedTx);
  console.log(recept);
}

async function signTx(path, keyStore, password, address) {
  let response;
  try {
    const mnemonic = await getMnemonic(password, keyStore);
    const nonce = await provider.getTransactionCount(address);
    const gasLimit = await provider.estimateGas({
      value: "0x1",
      to: address,
    });
    response = await signTxFromKeyStore(
      path,
      mnemonic,
      JSON.stringify({
        nonce,
        gasLimit: gasLimit.mul(10).toString(),
        maxFeePerGas: "2500000040",
        maxPriorityFeePerGas: "2500000000",
        to: address,
        value: "1",
        chainId: 44787,
      })
    );

    // eslint-disable-next-line no-console
    console.log("response - ", response);
    // test
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return response;
}

async function run() {
  const PASSWORD = MNEMONIC.password;
  const keyStore = await createKeyStore(PASSWORD);
  const account = await getAccount(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD
  );
  const signedTx = await signTx(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD,
    account.address
  );
  console.log(signedTx);
  await sendTx(signedTx.serializedTx);
}

run();
