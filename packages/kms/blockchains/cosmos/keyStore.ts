import { BIP32Interface } from "bip32";
import * as secp256k1 from "secp256k1";
import { enc, SHA256 } from "crypto-js";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { Account, Message, SignedTx } from "../../types";
import { cosmosSignTx } from "./signTx/cosmos";
import { terraSignTx } from "./signTx/terra";

export class KEYSTORE {
  static async getAccount(
    node: BIP32Interface | string,
    prefix: string
  ): Promise<Account> {
    const privateKey =
      typeof node !== "string"
        ? node.privateKey
        : Buffer.from(node.replace("0x", ""), "hex");

    if (privateKey) {
      const wallet = await DirectSecp256k1Wallet.fromKey(
        new Uint8Array(privateKey),
        prefix
      );

      const account = await wallet.getAccounts();
      return {
        address: account[0].address,
        publicKey: Buffer.from(account[0].pubkey).toString("base64"),
      };
    }
    return {
      address: "",
      publicKey: "",
    };
  }

  static async signTx(
    node: BIP32Interface | string,
    prefix: string,
    unsignedTx: string
  ): Promise<SignedTx> {
    const privateKey =
      typeof node !== "string"
        ? node.privateKey
        : Buffer.from(node.replace("0x", ""), "hex");
    const parsedTx = JSON.parse(unsignedTx);
    if (privateKey) {
      if (parsedTx.signerData) {
        return cosmosSignTx(privateKey, prefix, parsedTx);
      }
      return terraSignTx(privateKey, prefix, parsedTx);
    }
    return {};
  }

  static async signMessage(
    node: BIP32Interface | string,
    _prefix: string,
    msg: Message
  ) {
    const privateKey =
      typeof node !== "string"
        ? node.privateKey
        : Buffer.from(node.replace("0x", ""), "hex");

    if (privateKey) {
      const signature = secp256k1.ecdsaSign(
        Buffer.from(enc.Base64.stringify(SHA256(msg.data)), "base64"),
        privateKey
      );
      return { msg, signedMsg: { ...signature } };
    }
    return { msg };
  }
}
