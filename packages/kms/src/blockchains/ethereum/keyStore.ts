import { BIP32Interface } from "bip32";
import * as secp256k1 from "secp256k1";
import {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
} from "@ethereumjs/tx";
import {
  privateToAddress,
  privateToPublic,
  publicToAddress,
  rlp,
  bnToHex,
  keccak256,
  ecsign,
  BN,
  isHexString,
  fromUtf8,
  toBuffer,
  intToHex,
} from "ethereumjs-util";
import { Account, Message, SignedTx } from "../../types";

export class KEYSTORE {
  static getAccount(node: BIP32Interface | string): Account {
    if (typeof node !== "string") {
      return {
        address: `0x${publicToAddress(node.publicKey, true).toString("hex")}`,
        publicKey: `0x${node.publicKey.toString("hex")}`,
      };
    }
    return {
      address: `0x${privateToAddress(
        Buffer.from(node.replace("0x", ""), "hex")
      ).toString("hex")}`,
      publicKey: `0x${Buffer.from(
        secp256k1.publicKeyCreate(
          new Uint8Array(Buffer.from(node.replace("0x", ""), "hex")),
          true
        )
      ).toString("hex")}`,
    };
  }

  public static celoRLPEncode(
    parsedTx: any,
    vNum?: number,
    rHex?: string,
    sHex?: string
  ): Buffer {
    return rlp.encode([
      bnToHex(new BN(parsedTx.nonce)),
      bnToHex(new BN(parsedTx.gasPrice)),
      bnToHex(new BN(parsedTx.gasLimit)),
      parsedTx.feeCurrency || "0x",
      parsedTx.gatewayFeeRecipient || "0x",
      parsedTx.gatewayFee ? bnToHex(new BN(parsedTx.gatewayFee)) : "0x",
      parsedTx.to,
      parsedTx.value ? bnToHex(new BN(parsedTx.value)) : "0x",
      parsedTx.data || "0x",
      vNum || bnToHex(new BN(parsedTx.chainId)),
      rHex || "0x",
      sHex || "0x",
    ]);
  }

  private static celoSignTx(privateKey: Buffer, parsedTx: any): SignedTx {
    const rlpEncode = KEYSTORE.celoRLPEncode(parsedTx);
    const sig = ecsign(keccak256(rlpEncode), privateKey);

    const signature = KEYSTORE.celoRLPEncode(
      parsedTx,
      sig.v,
      `0x${sig.r.toString("hex")}`,
      `0x${sig.s.toString("hex")}`
    );

    return {
      hash: `0x${keccak256(signature).toString("hex")}`,
      serializedTx: `0x${signature.toString("hex")}`,
    };
  }

  private static eip155ignTx(privateKey: Buffer, parsedTx: any): SignedTx {
    const rlpEncode = rlp.encode([
      bnToHex(new BN(parsedTx.nonce)),
      bnToHex(new BN(parsedTx.gasPrice)),
      bnToHex(new BN(parsedTx.gasLimit)),
      parsedTx.to,
      parsedTx.value ? bnToHex(new BN(parsedTx.value)) : "0x",
      parsedTx.data || "0x",
      bnToHex(new BN(parsedTx.chainId)),
      "0x",
      "0x",
    ]);
    const sig = ecsign(keccak256(rlpEncode), privateKey);

    const signature = rlp.encode([
      bnToHex(new BN(parsedTx.nonce)),
      bnToHex(new BN(parsedTx.gasPrice)),
      bnToHex(new BN(parsedTx.gasLimit)),
      parsedTx.to,
      parsedTx.value ? bnToHex(new BN(parsedTx.value)) : "0x",
      parsedTx.data || "0x",
      bnToHex(
        new BN(
          27 +
            (sig.v === 0 || sig.v === 1 ? sig.v : 1 - (sig.v % 2)) +
            parseInt(parsedTx.chainId, 10) * 2 +
            8
        )
      ),
      `0x${sig.r.toString("hex")}`,
      `0x${sig.s.toString("hex")}`,
    ]);

    return {
      hash: `0x${keccak256(signature).toString("hex")}`,
      serializedTx: `0x${signature.toString("hex")}`,
    };
  }

  private static eip2930SignTx(privateKey: Buffer, parsedTx: any): SignedTx {
    const tx = AccessListEIP2930Transaction.fromTxData({
      nonce: bnToHex(new BN(parsedTx.nonce)),
      gasPrice: bnToHex(new BN(parsedTx.gasPrice)),
      gasLimit: bnToHex(new BN(parsedTx.gasLimit)),
      to: parsedTx.to,
      value: parsedTx.value ? bnToHex(new BN(parsedTx.value)) : "0x",
      data: parsedTx.data || "0x",
      chainId: bnToHex(new BN(parsedTx.chainId)),
      accessList: parsedTx.accessList ? parsedTx.accessList : [],
    });
    const signedTx = tx.sign(privateKey);
    return {
      hash: `0x${keccak256(signedTx.serialize()).toString("hex")}`,
      serializedTx: `0x${signedTx.serialize().toString("hex")}`,
    };
  }

  private static eip1559SignTx(privateKey: Buffer, parsedTx: any): SignedTx {
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      nonce: bnToHex(new BN(parsedTx.nonce)),
      gasLimit: bnToHex(new BN(parsedTx.gasLimit)),
      to: parsedTx.to,
      value: bnToHex(new BN(parsedTx.value)),
      data: parsedTx.data || "0x",
      chainId: bnToHex(new BN(parsedTx.chainId)),
      accessList: parsedTx.accessList ? parsedTx.accessList : [],
      maxPriorityFeePerGas: parsedTx.maxPriorityFeePerGas
        ? bnToHex(new BN(parsedTx.maxPriorityFeePerGas))
        : "0x",
      maxFeePerGas: parsedTx.maxFeePerGas
        ? bnToHex(new BN(parsedTx.maxFeePerGas))
        : "0x",
    });
    const signedTx = tx.sign(privateKey);
    return {
      hash: `0x${keccak256(signedTx.serialize()).toString("hex")}`,
      serializedTx: `0x${signedTx.serialize().toString("hex")}`,
    };
  }

  static signTx(node: BIP32Interface | string, unsignedTx: string): SignedTx {
    const privateKey =
      typeof node !== "string"
        ? node.privateKey
        : Buffer.from(node.replace("0x", ""), "hex");
    const parsedTx = JSON.parse(unsignedTx);
    if (privateKey) {
      if (parsedTx.feeCurrency) {
        return KEYSTORE.celoSignTx(privateKey, parsedTx);
      }

      if (parsedTx.maxFeePerGas) {
        return KEYSTORE.eip1559SignTx(privateKey, parsedTx);
      }

      if (parsedTx.accessList) {
        return KEYSTORE.eip2930SignTx(privateKey, parsedTx);
      }

      return KEYSTORE.eip155ignTx(privateKey, parsedTx);
    }

    return {};
  }

  static async signMessage(node: BIP32Interface | string, msg: Message) {
    const privateKey =
      typeof node !== "string"
        ? node.privateKey
        : Buffer.from(node.replace("0x", ""), "hex");

    const hexToBytes = (hex: string) => {
      const bytes = [];
      for (let i = 0; i < hex.length; i += 2)
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
      return bytes;
    };
    if (privateKey) {
      const msgHex = isHexString(msg.data) ? msg.data : fromUtf8(msg.data);
      const messageBytes = hexToBytes(msgHex.replace("0x", ""));
      const messageBuffer = toBuffer(msgHex);
      let messageHash: Buffer = messageBuffer;
      if (
        !msg.type ||
        msg.type === "eth_sign" ||
        msg.type === "personal_sign"
      ) {
        const preamble = `\x19Ethereum Signed Message:\n${messageBytes.length}`;
        const preambleBuffer = Buffer.from(preamble);
        const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
        messageHash = keccak256(ethMessage);
      }
      const sig = ecsign(messageHash, privateKey);
      const signature = Buffer.concat([
        sig.r,
        sig.s,
        toBuffer(intToHex(sig.v)),
      ]).toString("hex");

      return {
        msg,
        signedMsg: {
          signature: `0x${signature}`,
          publicKey: `0x${privateToPublic(privateKey).toString("hex")}`,
        },
      };
    }
    return { msg };
  }
}
