/* eslint-disable no-console */
import { Account } from '@dsrv/kms/src/types';
import { RPC_URL } from '../constants';

const { AptosClient, TxnBuilderTypes, BCS, getAccountResources } = require('aptos');
// eslint-disable-next-line camelcase
const { sha3_256 } = require('js-sha3');

const API = RPC_URL.APTOS;

const aptos = new AptosClient(API);

const getAccountExists = async (address: string) => {
  try {
    await aptos.getAccountResources(address);
  } catch (error) {
    const chainId = await aptos.getChainId();
    const url = `https://faucet.${
      chainId === 2 ? 'testnet' : 'devnet'
    }.aptoslabs.com/mint?amount=0&address=${address.replace('0x', '')}`;
    // eslint-disable-next-line no-undef
    await fetch(url, { method: 'POST' });
    await getAccountResources(aptos, address);
  }
};

export const getAptosSerializedTx = async (account: Account) => {
  const MAX_GAS_AMOUNT = 150;
  const GAS_UNIT_PRICE = 1;
  const amount = 10;

  await getAccountExists(account.address);
  const { sequence_number: sequenceNumber } = await aptos.getAccount(account.address);
  const chainId = await aptos.getChainId();
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

  const rawTxnWithSalt = `0x${Buffer.concat([
    Buffer.from(sha3_256(Buffer.from('APTOS::RawTransaction', 'ascii')), 'hex'),
    Buffer.from(BCS.bcsToBytes(rawTxn)),
  ]).toString('hex')}`;

  return rawTxnWithSalt;
};
