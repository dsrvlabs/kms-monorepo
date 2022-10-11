import { encode, decode } from "bs58";
import nacl from "tweetnacl";
// eslint-disable-next-line camelcase
import { sha3_256 } from "js-sha3";
import { derivePath } from "ed25519-hd-key";
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
  ): nacl.SignKeyPair {
    const temp = typeof seed === "string" ? decode(seed) : seed;
    const secretKey = path ? KEYSTORE.getPrivateKey(temp, path) : encode(temp);
    const keyPair = nacl.sign.keyPair.fromSecretKey(decode(secretKey));
    return keyPair;
  }

  static getAccount(seed: Buffer | string, path?: BIP44): Account {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    const hash = sha3_256.create();
    hash.update(Buffer.from(keyPair.publicKey));
    hash.update("\x00");
    return {
      address: `0x${hash.hex()}`,
      publicKey: `0x${Buffer.from(keyPair.publicKey).toString("hex")}`,
    };
  }

  static signTx(
    seed: Buffer | string,
    serializedTx: string,
    path?: BIP44
  ): SignedTx {
    const keyPair = KEYSTORE.getKeyPair(seed, path);
    const signature = Buffer.from(
      nacl.sign(
        Buffer.from(serializedTx.replace("0x", ""), "hex"),
        keyPair.secretKey
      )
    )
      .toString("hex")
      .slice(0, 128);

    const hashTx = sha3_256(
      Buffer.from(
        // sha3_256(Buffer.from("APTOS::Transaction", "ascii"))
        `fa210a9417ef3e7fa45bfa1d17a8dbd4d883711910a550d265fee189e9266dd400${serializedTx
          .replace("0x", "")
          .slice(64)}0020${Buffer.from(keyPair.publicKey).toString(
          "hex"
        )}40${signature}`,
        "hex"
      )
    );

    return {
      serializedTx,
      hash: `0x${hashTx}`,
      signature: `0x${signature}`,
    };
  }
}
