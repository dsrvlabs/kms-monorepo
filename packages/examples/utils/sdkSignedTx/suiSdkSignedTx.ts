import { RawSigner, Ed25519Keypair } from '@mysten/sui.js';
import { suiProvider } from '../getTx';

export const suiSdkSignedTx = async (mnemonic: string, unSignedTx: Uint8Array) => {
  const keyPair = Ed25519Keypair.deriveKeypair(mnemonic);
  const signer = new RawSigner(keyPair, suiProvider as any);
  const { signature } = await signer.signTransactionBlock({
    transactionBlock: unSignedTx,
  });

  return `0x${Buffer.from(signature, 'base64').toString('hex')}`;
};
