import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Account, BIP44 } from "../../types";
import { encodeAddress } from "./hw";
import { getDerivePath } from "../getDerivePath";

// import { RawTx, SignedTx } from "../../types";

export class KEYSTORE {
  static getPrivateKey(seed: Buffer, path: BIP44): string {
    const { key } = derivePath(getDerivePath(path)[0], seed.toString("hex"));
    return `0x${Buffer.from(key).toString("hex")}`;
  }

  private static getKeypair(seed: Buffer, path: BIP44): nacl.SignKeyPair {
    const key = KEYSTORE.getPrivateKey(seed, path).replace("0x", "");
    return nacl.sign.keyPair.fromSeed(Buffer.from(key, "hex"));
  }

  static getAccount(seed: Buffer, path: BIP44): Account {
    const keyPair = KEYSTORE.getKeypair(seed, path);
    return {
      address: encodeAddress(Buffer.from(keyPair.publicKey)),
      publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    };
  }

  /*
  static signTx(node: BIP32Interface, rawTx: RawTx): SignedTx {
    // ...
  }
  */

  /*
  export signMessage(node: BIP32Interface, msg: string) {
    // ...
  }
  */
}
