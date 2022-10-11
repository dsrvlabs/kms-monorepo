const { JWE } = require("node-jose");
const { encode } = require("bs58");
const { randomBytes } = require("crypto");
const {
  CHAIN,
  getAccountFromKeyStore,
  signTxFromKeyStore,
  signMsgFromKeyStore,
  getAlgo2HashKey,
} = require("../../lib");

const MNEMONIC = require("../mnemonic.json");

const LENGTH = 32;

async function getMnemonic(password, keyStore) {
  const key = await getAlgo2HashKey(password || "", keyStore);
  if (key) {
    const mnemonic = await JWE.createDecrypt(key).decrypt(keyStore.j.join("."));
    return mnemonic.plaintext.toString();
  }
  return "";
}

async function createKeyStore(password) {
  const mnemonic = MNEMONIC.bip44.split(" ");
  const encoder = new TextEncoder();
  const opt = { t: 2, m: 2048, s: encode(randomBytes(LENGTH)), j: [] };
  const key = await getAlgo2HashKey(password, opt);
  const jwe = await JWE.createEncrypt(
    { format: "compact", contentAlg: "A256GCM" },
    key
  )
    .update(encoder.encode(mnemonic.join(" ")))
    .final();
  return { ...opt, j: jwe.split(".") };
}

exports.getAccount = async function getAccount(path, keyStore, password) {
  try {
    const key = await getAlgo2HashKey(password, keyStore);
    const decryped = await JWE.createDecrypt(key).decrypt(keyStore.j.join("."));
    const account = await getAccountFromKeyStore(
      path,
      decryped.plaintext.toString()
    );
    // eslint-disable-next-line no-console
    console.log("account - ", account);
    return account;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};

exports.getMnemonic = getMnemonic;
exports.createKeyStore = createKeyStore;
exports.CHAIN = CHAIN;
exports.signTxFromKeyStore = signTxFromKeyStore;
exports.signMsgFromKeyStore = signMsgFromKeyStore;
exports.MNEMONIC = require("../mnemonic.json");
