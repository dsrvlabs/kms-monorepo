import { Account, CHAIN } from '@dsrv/kms/src/types';
import { RPC_URL } from 'examples/constants';

import { Aptos } from '@dsrv/kms';
import { decode } from 'bs58';
import { getAccountExists } from 'examples/utils/getSerializedTx/getAptosSerializedTx';
import { bytesToHex } from './common';

const { sign: naclSign } = require('tweetnacl');

const { AptosClient, BCS, TxnBuilderTypes, TransactionBuilderEd25519 } = require('aptos');

const API = RPC_URL.APTOS;

const aptos = new AptosClient(API);

export const sign = (
  rawTxn: typeof TxnBuilderTypes.RawTransaction,
  privateKeyBytes: Uint8Array,
): string => {
  // const privateKeyBytes = new HexString(stringToHex(privateKey)).toUint8Array();
  // const privateKeyBytes = new HexString(privateKey).toUint8Array();
  // console.log('privateKeyBytes', privateKeyBytes);
  const signingKey = naclSign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
  // console.log('signingKey', signingKey);
  const { publicKey } = signingKey;
  const txnBuilder = new TransactionBuilderEd25519(
    (signingMessage) =>
      new TxnBuilderTypes.Ed25519Signature(
        naclSign(signingMessage, signingKey.secretKey).slice(0, 64),
      ),
    publicKey,
  );
  return bytesToHex(txnBuilder.sign(rawTxn));
};
export const getAptosSdkSign = async (account: Account, mnemonic: string) => {
  const MAX_GAS_AMOUNT = 150;
  const GAS_UNIT_PRICE = 1;
  const amount = 10;
  const chainId = await aptos.getChainId();
  await getAccountExists(account.address);
  const { sequence_number: sequenceNumber } = await aptos.getAccount(account.address);
  const expirationTimestampSecs = Math.floor(Date.now() / 1000) + 300;
  const token = new TxnBuilderTypes.TypeTagStruct(
    TxnBuilderTypes.StructTag.fromString('0x1::aptos_coin::AptosCoin'),
  );
  const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
    TxnBuilderTypes.EntryFunction.natural(
      '0x1::coin',
      'transfer',
      [token],
      [
        BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(account.address)),
        BCS.bcsSerializeUint64(amount),
      ],
    ),
  );
  const rawTxn = new TxnBuilderTypes.RawTransaction(
    TxnBuilderTypes.AccountAddress.fromHex(account.address),
    sequenceNumber,
    entryFunctionPayload,
    MAX_GAS_AMOUNT,
    GAS_UNIT_PRICE,
    expirationTimestampSecs.toString(),
    new TxnBuilderTypes.ChainId(chainId),
  );

  const privateKey = Aptos.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  const secretKey = decode(privateKey);
  const keyPair = naclSign.keyPair.fromSecretKey(secretKey);
  // console.log('privateley', keyPair);
  const signedTxn = sign(rawTxn, keyPair.secretKey);
  return signedTxn;
};
