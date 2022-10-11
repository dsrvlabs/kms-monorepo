import Transport from "@ledgerhq/hw-transport";
import { encode } from "bs58";
import sha256 from "js-sha256";
import { Account, BIP44, SignedTx } from "../../types";

const App = require("near-ledger-js");

export class LEDGER {
  static async getAccount(path: BIP44, transport: Transport): Promise<Account> {
    transport.setScrambleKey("NEAR");
    const client = await App.createClient(transport);
    const response = await client.getPublicKey(
      `44'/${path.type}'/${path.account}'/0'/${path.index}'`
    );
    return {
      address: `ed25519:${encode(response)}`,
      publicKey: `ed25519:${encode(response)}`,
    };
  }

  static async signTx(
    path: BIP44,
    transport: Transport,
    serializedTx: string
  ): Promise<SignedTx> {
    const client = await App.createClient(transport);
    const PATH = `44'/${path.type}'/${path.account}'/0'/${path.index}'`;
    const temp = Buffer.from(serializedTx, "base64");
    const response = await client.sign(temp, PATH);
    return {
      hash: encode(new Uint8Array(sha256.sha256.array(temp))),
      serializedTx,
      signature: `0x${Buffer.from(response).toString("hex")}`,
    };
  }

  /*
  export function signMessage(
    path: BIP44,
    transport: Transport,
    msg: string) {
    // ...
  }
  */
}
