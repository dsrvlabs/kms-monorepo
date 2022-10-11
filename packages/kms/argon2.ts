import { JWK, JWE, util } from "node-jose";
import { encode, decode } from "bs58";
import { randomBytes } from "crypto";
// import { hash } from "argon2-browser";
import { KeyStore } from "./types";

const { hash } = require("argon2-browser");

const LENGTH = 32;

export async function getAlgo2HashKey(
  password: string,
  keyStore: KeyStore
): Promise<JWK.Key | null> {
  const buf = await hash({
    pass: password,
    time: keyStore.t,
    mem: keyStore.m,
    salt: decode(keyStore.s),
    hashLen: LENGTH,
  });
  const key = await JWK.asKey({
    kty: "oct",
    k: util.base64url.encode(buf.hashHex),
  });
  return key;
}

export async function getMnemonic(
  password: string,
  keyStore: KeyStore
): Promise<string> {
  const key = await getAlgo2HashKey(password || "", keyStore);
  if (key) {
    const mnemonic = await JWE.createDecrypt(key).decrypt(keyStore.j.join("."));
    return mnemonic.plaintext.toString();
  }
  return "";
}

export async function createKeyStore(
  mnemonic: string[],
  password: string,
  time: number = 100,
  mem: number = 10
): Promise<KeyStore | null> {
  const encoder = new TextEncoder();
  const opt = { t: time, m: mem, s: encode(randomBytes(LENGTH)), j: [] };
  const key = await getAlgo2HashKey(password, opt);
  if (key) {
    const jwe = await JWE.createEncrypt(
      { format: "compact", contentAlg: "A256GCM" },
      key
    )
      .update(encoder.encode(mnemonic.join(" ")))
      .final();
    return { ...opt, j: jwe.split(".") };
  }
  return null;
}
