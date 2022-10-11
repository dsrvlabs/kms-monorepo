import { encode, decode } from "bs58";
import nacl from "tweetnacl";
// eslint-disable-next-line camelcase
import { sha3_256 } from "js-sha3";
import { derivePath } from "ed25519-hd-key";
import { Ed25519Keypair, Base64DataBuffer } from "@mysten/sui.js";
import { Account, BIP44, SignedTx } from "../../types";
import { getDerivePath } from "../getDerivePath";

export class KEYSTORE {
  static getPrivateKey(seed: Buffer, path: BIP44): string {
    const { key } = derivePath(getDerivePath(path)[0], seed.toString("hex"));
    const keyPair = nacl.sign.keyPair.fromSeed(key);
    return `${encode(Buffer.from(keyPair.secretKey))}`;
  }

  private static getKeyPair(
    seed: Buffer | string,
    path?: BIP44
  ): Ed25519Keypair {
    const temp = typeof seed === "string" ? decode(seed) : seed;
    const secretKey = path ? KEYSTORE.getPrivateKey(temp, path) : encode(temp);
    const keyPair = Ed25519Keypair.fromSecretKey(decode(secretKey), {
      skipValidation: true, // TODO: remove after TextEncode bug fix
    });
    return keyPair;
  }

  static getAccount(seed: Buffer | string, path?: BIP44): Account {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    return {
      address: `0x${keyPair.getPublicKey().toSuiAddress()}`,
      publicKey: keyPair.getPublicKey().toString(),
    };
  }

  static signTx(
    seed: Buffer | string,
    serializedTx: string,
    path?: BIP44
  ): SignedTx {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    const hashTx = Buffer.from(
      sha3_256(Buffer.from(serializedTx, "base64")),
      "hex"
    ).toString("base64");
    const signature = keyPair.signData(new Base64DataBuffer(serializedTx));

    return {
      serializedTx,
      hash: hashTx,
      signature: signature.toString(),
    };
  }
}
