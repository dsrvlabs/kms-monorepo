/* eslint-disable no-console */
import { Account } from '@dsrv/kms/src/types';
import { providers, transactions, utils } from 'near-api-js';

import { AccessKeyView } from 'near-api-js/lib/providers/provider';

const BN = require('bn.js');

export const getNearSerializedTx = async (account: Account) => {
  const rpc = 'https://rpc.testnet.near.org';
  const provider = new providers.JsonRpcProvider({ url: rpc });
  const helperURL = `https://near-utils.welldonestudio.io/accounts?address=${account.address}`;
  const accountIds = await fetch(helperURL).then((res) => res.json());

  const signerId = accountIds[Object.keys(accountIds).length - 1];
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
    accountIds,
    utils.PublicKey.fromString(publicKey),
    '9bfd12934cd6fdd09199e2e267803c70bd7c6cb40832ac6f29811948dde2b723', // allthatnode
    accessKey.nonce + 1,
    actions,
    recentBlockHash,
  );

  const bytes = transaction.encode();

  return Buffer.from(bytes).toString('base64');
};
