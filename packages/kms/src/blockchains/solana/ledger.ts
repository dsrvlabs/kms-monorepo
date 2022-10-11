import Transport from "@ledgerhq/hw-transport";
import base58 from "bs58";
import { Transaction } from "@solana/web3.js";
import { getPublicKey, getSolanaDerivationPath, signTransaction } from "./hw";
import { Account, BIP44, SignedTx } from "../../types";

// LEDGER
export class LEDGER {
  static async getAccount(path: BIP44, transport: Transport): Promise<Account> {
    const response = await getPublicKey(
      transport,
      getSolanaDerivationPath(path.account, path.index)
    );
    return {
      address: response.toBase58(),
      publicKey: response.toBase58(),
    };
  }

  static async signTx(
    path: BIP44,
    transport: Transport,
    serializedTx: string
  ): Promise<SignedTx> {
    const transaction = Transaction.from(
      Buffer.from(serializedTx.replace("0x", ""), "hex")
    );
    const signature = await signTransaction(
      transport,
      transaction,
      getSolanaDerivationPath(path.account, path.index)
    );
    return {
      hash: base58.encode(Uint8Array.from(signature)),
      serializedTx,
      signature: `0x${Buffer.from(signature).toString("hex")}`,
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
