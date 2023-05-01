import { Ed25519Keypair, RawSigner } from '@mysten/sui.js';
import { suiProvider } from '../getTx';

export const suiSdkSignedMsg = async (mnemonic, message) => {
  const keyPair = Ed25519Keypair.deriveKeypair(mnemonic);
  const signer = new RawSigner(keyPair, suiProvider as any);

  const signedMsg = await signer.signMessage({ message: Buffer.from(message, 'utf8') });
  return `0x${Buffer.from(signedMsg.signature, 'base64').toString('hex')}`;
};
