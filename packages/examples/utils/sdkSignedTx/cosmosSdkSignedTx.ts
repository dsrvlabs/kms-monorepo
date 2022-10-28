/* eslint-disable no-unused-vars */
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { Cosmos } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { getCosmosTx } from '../getTx';

export const cosmosSdkSignedTx = async (mnemonic: string) => {
  const cosmosAccount = Cosmos.getAccount({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });
  const { unSignedTx } = await getCosmosTx(mnemonic);

  const privateKey = Cosmos.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });

  const bufferPrivateKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
  const wallet = await DirectSecp256k1Wallet.fromKey(new Uint8Array(bufferPrivateKey));
  // same
  const { signature } = await wallet.signDirect(cosmosAccount.address, unSignedTx);

  return signature;
};
