/* eslint-disable camelcase */
/* eslint-disable no-console */
import { AptosClient, TxnBuilderTypes, BCS } from 'aptos';
import { sha3_256 } from 'js-sha3';
import { RPC_URL } from '../../constants';
import { getAptosAccount } from '../getAccount';

const API = RPC_URL.APTOS;

const aptos = new AptosClient(API);

export const getAccountExists = async (address: string) => {
  try {
    await aptos.getAccountResources(address);
  } catch (error) {
    const chainId = await aptos.getChainId();
    const url = `https://faucet.${
      chainId === 2 ? 'testnet' : 'devnet'
    }.aptoslabs.com/mint?amount=0&address=${address.replace('0x', '')}`;
    // eslint-disable-next-line no-undef
    await fetch(url, { method: 'POST' });
    await aptos.getAccountResources(address);
  }
};

export const getAptosTx = async (mnemonic: string) => {
  const MAX_GAS_AMOUNT = 150;
  const GAS_UNIT_PRICE = 100;
  const amount = 100;

  const account = getAptosAccount(mnemonic);

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
    BigInt(sequenceNumber),
    entryFunctionPayload,
    BigInt(MAX_GAS_AMOUNT),
    BigInt(GAS_UNIT_PRICE),
    BigInt(expirationTimestampSecs),
    new TxnBuilderTypes.ChainId(chainId),
  );

  const rawTxnWithSalt = `0x${Buffer.concat([
    Buffer.from(sha3_256(Buffer.from('APTOS::RawTransaction', 'ascii')), 'hex'),
    Buffer.from(BCS.bcsToBytes(rawTxn)),
  ]).toString('hex')}`;

  return {
    serializedTx: rawTxnWithSalt,
    unSignedTx: rawTxn as TxnBuilderTypes.RawTransaction,
  };
};
