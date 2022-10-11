const secp256k1 = require("secp256k1");
const sha = require("js-sha256");
const didJWT = require("did-jwt");
const { pubkeyToAddress } = require("@cosmjs/amino");
const { KMS, CHAIN } = require("../../lib");

const { createKeyStore, getAccount } = require("./_getAccount");

const MNEMONIC = require("../mnemonic.json");

const TYPE = CHAIN.DSRV;
const INDEX = 0;

function verifySignature(signature, message, account) {
  const digest = sha.sha256.update(message).digest();
  const pubKey = secp256k1.ecdsaRecover(signature, 1, new Uint8Array(digest));
  const address = pubkeyToAddress(
    {
      type: "tendermint/PubKeySecp256k1",
      value: Buffer.from(pubKey).toString("base64"),
    },
    "dsrv"
  );

  const result = secp256k1.ecdsaVerify(
    signature,
    new Uint8Array(digest),
    pubKey
  );

  return result && account.address === address;
}

async function signMsg(path, keyStore, password, account) {
  const kms = new KMS({
    keyStore,
    transport: null,
  });
  try {
    const message = "test message";
    const response = await kms.signMsg({ ...path, password }, message);
    // eslint-disable-next-line no-console
    console.log("response - ", response);
    console.log(
      "verify - ",
      verifySignature(response.signedMsg.signature, message, account)
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function did(path, keyStore, password) {
  const kms = new KMS({
    keyStore,
    transport: null,
  });
  const jwt = await kms.DidDocCreate({ ...path, password }, "dsrv did");
  console.log("did doc is ", jwt);
  const decode = didJWT.decodeJWT(jwt);
  const verify = await KMS.DidDocVerify(jwt, decode.payload.aud);
  console.log("verify", JSON.stringify(verify, null, 2));
}

async function run() {
  const PASSWORD = MNEMONIC.password;
  const keyStore = await createKeyStore(PASSWORD);
  const account = await getAccount(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD
  );
  await signMsg(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD,
    account
  );
  await did(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD,
    account
  );
}

run();
