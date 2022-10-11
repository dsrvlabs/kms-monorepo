import Transport from "@ledgerhq/hw-transport";
import { Account, BIP44 } from "../../types";
import { getDerivePath } from "../getDerivePath";

const FlowApp = require("@onflow/ledger").default;

// LEDGER
export class LEDGER {
  static async getAccount(path: BIP44, transport: Transport): Promise<Account> {
    const instance = new FlowApp(transport);
    const response = await instance.getAddressAndPubKey(getDerivePath(path)[0]);
    // console.log(response);
    return {
      address: response.address,
      publicKey: (response.publicKey as Buffer).toString("hex"),
    };
  }

  /*
  static async signTx(
    path: BIP44,
    transport: Transport,
    rawTx: RawTx
  ): Promise<SignedTx> {
    // ...
  }

  export function signMessage(
    path: BIP44,
    transport: Transport,
    msg: string) {
    // ...
  }
  */
}
