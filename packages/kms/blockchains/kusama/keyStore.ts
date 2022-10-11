import { BIP32Interface } from "bip32";
import { naclKeypairFromSeed, encodeAddress } from "@polkadot/util-crypto";
import { Account } from "../../types";

export class KEYSTORE {
  static getAccount(node: BIP32Interface): Account {
    const ss58Format = 2;
    const pk = node.privateKey
      ? new Uint8Array(node.privateKey.buffer)
      : new Uint8Array(32);
    const account = naclKeypairFromSeed(pk);
    return {
      address: encodeAddress(
        `0x${Buffer.from(account.publicKey).toString("hex")}`,
        ss58Format
      ),
      publicKey: Buffer.from(account.publicKey).toString("hex"),
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
