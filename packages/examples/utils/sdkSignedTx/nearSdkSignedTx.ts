/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { Near } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/src/types';
import { sha256 } from 'js-sha256';
import { transactions, utils } from 'near-api-js';
import { getNearTx } from '../getTx';
import { sendNearTransaction } from '../sendTransaction';

export const nearSdkSignedTx = async (mnemonic: string) => {
  const nearAccount = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });

  /* get serializedTx */
  const { unSignedTx } = await getNearTx(nearAccount);
  const serializedTx = utils.serialize.serialize(transactions.SCHEMA, unSignedTx);
  const serializedTxHash = new Uint8Array(sha256.array(serializedTx));

  /* get signature */
  const privateKey = Near.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  const keyPair = utils.key_pair.KeyPairEd25519.fromString(privateKey);
  const signature = keyPair.sign(serializedTxHash);

  const signTrnasaction = new transactions.SignedTransaction({
    unSignedTx,
    signature: new transactions.Signature({
      keyType: unSignedTx.publicKey.keyType,
      data: signature.signature,
    }),
  });
  const signedSerializedTx = signTrnasaction.encode();

  const transaction = await sendNearTransaction(Buffer.from(signedSerializedTx).toString('base64'));
  return transaction;
};
