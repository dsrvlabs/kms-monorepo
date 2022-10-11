import { encode, decode } from "bs58";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import sha256 from "js-sha256";
import { utils } from "near-api-js";
import { Account, BIP44, Message, SignedTx } from "../../types";
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
    // eslint-disable-next-line camelcase
  ): utils.key_pair.KeyPair {
    const temp = typeof seed === "string" ? decode(seed) : seed;
    const secretKey = path ? KEYSTORE.getPrivateKey(temp, path) : encode(temp);
    const keyPair = utils.key_pair.KeyPairEd25519.fromString(secretKey);
    return keyPair;
  }

  static getAccount(seed: Buffer | string, path?: BIP44): Account {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    return {
      address: keyPair.getPublicKey().toString(),
      publicKey: keyPair.getPublicKey().toString(),
    };
  }

  static signTx(
    seed: Buffer | string,
    serializedTx: string,
    path?: BIP44
  ): SignedTx {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    const byte = Buffer.from(serializedTx, "base64");
    const hashTx = sha256.sha256.array(byte);
    const { signature } = keyPair.sign(new Uint8Array(hashTx));
    return {
      serializedTx,
      hash: encode(new Uint8Array(hashTx)),
      signature: `0x${Buffer.from(signature).toString("hex")}`,
    };
  }

  static async signMessage(seed: Buffer | string, msg: Message, path?: BIP44) {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    const hash = sha256.sha256.array(
      new Uint8Array(
        Buffer.from(
          msg.data.replace("0x", ""),
          msg.data.startsWith("0x") ? "hex" : "utf8"
        )
      )
    );
    const { signature } = keyPair.sign(new Uint8Array(hash));
    return {
      msg,
      signedMsg: {
        signature: `0x${Buffer.from(signature).toString("hex")}`,
        publicKey: keyPair.getPublicKey().toString(),
      },
    };
  }
}
