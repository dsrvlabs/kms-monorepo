import { decode, encode } from 'bs58';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { baseEncode } from 'borsh';
import TonWeb from 'tonweb';
import { sha256 } from '@noble/hashes/sha256';
import { getDerivePath, Signer } from '../signer';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { addHexPrefix, stringToHex, stripHexPrefix } from '../utils';

export { CHAIN } from '../../types';

export class Ton extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { seed } = Signer.getChild(pk);
    const { key } = derivePath(getDerivePath(pk.path)[0], seed.toString('hex'));
    const keyPair = naclSign.keyPair.fromSeed(key);

    return `${encode(Buffer.from(keyPair.secretKey))}`;
  }

  protected static getKeyPair(pk: string | PathOption): SignKeyPair {
    const secretKey = decode(Ton.getPrivateKey(pk));
    const keyPair = naclSign.keyPair.fromSecretKey(secretKey);

    return keyPair;
  }

  static async getAccount(pk: string | PathOption): Promise<Account> {
    const keyPair = Ton.getKeyPair(pk);
    const publicKey = baseEncode(keyPair.publicKey);

    // @TODO remove tonweb package
    const tonweb = new TonWeb(
      new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'),
    );
    const WalletClass = tonweb.wallet.all.v3R2;
    const wallet = new WalletClass(tonweb.provider, {
      publicKey: keyPair.publicKey,
      wc: 0,
    });
    const walletAddress = (await wallet.getAddress()).toString(true, true, true);

    return {
      address: walletAddress,
      publicKey,
    };
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);

    const keyPair = Ton.getKeyPair(pk);
    const hash = sha256(Buffer.from(stripHexPrefix(unsignedTx), 'hex'));
    const signature = naclSign.detached(new Uint8Array(hash), new Uint8Array(keyPair.secretKey));

    return {
      unsignedTx,
      signature: addHexPrefix(Buffer.from(signature).toString('hex')),
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const hexMsg = stringToHex(message);
    super.isHexString(hexMsg);

    const keyPair = Ton.getKeyPair(pk);
    const hash = sha256(Buffer.from(stripHexPrefix(hexMsg), 'hex'));
    const signature = naclSign.detached(new Uint8Array(hash), new Uint8Array(keyPair.secretKey));

    return {
      message,
      signature: addHexPrefix(Buffer.from(signature).toString('hex')),
    };
  }
}
