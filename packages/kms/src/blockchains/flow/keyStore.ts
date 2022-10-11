import { BIP32Interface } from "bip32";
import { ec as EC } from "elliptic";
import { Account } from "../../types";

export class KEYSTORE {
  static getAccount(node: BIP32Interface | string): Account {
    const privateKey =
      typeof node !== "string"
        ? node.privateKey
        : Buffer.from(node.replace("0x", ""), "hex");

    const ec = new EC("secp256k1");
    const keyPair = ec.keyFromPrivate(privateKey as Buffer);
    return {
      address: keyPair.getPublic().encode("hex", false), // .slice(2);
      publicKey: keyPair.getPublic().encode("hex", false),
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
