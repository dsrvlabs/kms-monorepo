/* eslint-disable no-console */
import { providers, transactions, utils } from 'near-api-js';

import { AccessKeyView } from 'near-api-js/lib/providers/provider';
import { RPC_URL } from '../../constants';
import { getNearAccount } from '../getAccount';

const BN = require('bn.js');

export const getNearTx = async (mnemonic: string) => {
  const account = getNearAccount(mnemonic);
  const rpc = RPC_URL.NEAR;
  const provider = new providers.JsonRpcProvider({ url: rpc });
  const helperURL = `https://api.welldonestudio.io/wds-near-util/accounts?address=${account.address}`;
  const accountIds = await fetch(helperURL).then((res) => res.json());

  const testnetAccountIds = accountIds.filter((el) => {
    const splitAccount = el.split('.');
    return splitAccount[1] === 'testnet';
  });

  const signerId = testnetAccountIds[Object.keys(testnetAccountIds).length - 1];
  const { publicKey } = account;

  const param = {
    request_type: 'view_access_key',
    finality: 'final',
    account_id: signerId,
    public_key: publicKey,
  };

  const accessKey = await provider.query<AccessKeyView>(param);
  const actions = [transactions.transfer(new BN(10))];
  const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);

  const transaction = transactions.createTransaction(
    testnetAccountIds[0],
    utils.PublicKey.fromString(publicKey),
    testnetAccountIds[0],
    Number(accessKey.nonce) + Math.floor(Math.random() * 10) + 224643000032,
    actions,
    recentBlockHash,
  );

  const bytes = transaction.encode();

  // const serializedTx = utils.serialize.serialize(transactions.SCHEMA, transaction);

  return {
    serializedTx: `0x${Buffer.from(bytes).toString('hex')}`,
    unSignedTx: transaction,
  };
};

export const getNearOfflineTx = async (mnemonic: string) => {
  const account = getNearAccount(mnemonic);
  const rpc = RPC_URL.NEAR;
  const provider = new providers.JsonRpcProvider({ url: rpc });
  const helperURL = `https://api.welldonestudio.io/wds-near-util/accounts?address=${account.address}`;
  const accountIds = await fetch(helperURL).then((res) => res.json());

  const testnetAccountIds = accountIds.filter((el) => {
    const splitAccount = el.split('.');
    return splitAccount[1] === 'testnet';
  });

  const signerId = testnetAccountIds[Object.keys(testnetAccountIds).length - 1];
  const { publicKey } = account;

  const param = {
    request_type: 'view_access_key',
    finality: 'final',
    account_id: signerId,
    public_key: publicKey,
  };

  const accessKey = await provider.query<AccessKeyView>(param);
  const actions = [transactions.transfer(new BN(10))];

  const transaction = transactions.createTransaction(
    testnetAccountIds[0],
    utils.PublicKey.fromString(publicKey),
    testnetAccountIds[0],
    accessKey.nonce,
    actions,
    utils.serialize.base_decode('B1PSZitfHMpybsD4cZseKYvmhGyQwuAFb6FmBSXckZ2R'),
  );

  const bytes = transaction.encode();

  return {
    serializedTx: `0x${Buffer.from(bytes).toString('hex')}`,
    unSignedTx: transaction,
  };
};
