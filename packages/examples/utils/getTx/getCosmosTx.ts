import { Account } from '@dsrv/kms/src/types';
import {
  Registry,
  makeAuthInfoBytes,
  makeSignDoc,
  encodePubkey,
  makeSignBytes,
} from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino';
import { RPC_URL, RECEIVER_ADDRESS } from '../../constants';

const { StargateClient, defaultRegistryTypes } = require('@cosmjs/stargate');

const getTxBodyBytes = (transaction) => {
  const registry = new Registry(defaultRegistryTypes);

  const txBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: {
      messages: transaction.msgs,
      memo: transaction.memo,
    },
  };

  const txBodyBytes = registry.encode(txBodyEncodeObject);
  return txBodyBytes;
};

const getAuthInfoBytes = (transaction, account) => {
  const bufferPubkey = Buffer.from(account.publicKey, 'base64');
  const pubkey = encodePubkey(encodeSecp256k1Pubkey(bufferPubkey));
  const authInfoBytes = makeAuthInfoBytes(
    [
      {
        pubkey,
        sequence: transaction.signerData.sequence,
      },
    ],
    transaction.fee.amount,
    Number(transaction.fee.gas),
    undefined,
    undefined,
  );
  return authInfoBytes;
};

export const getCosmosTx = async (account: Account) => {
  /* create transaction */
  const rpcUrl = RPC_URL.COSMOS;
  const client = await StargateClient.connect(rpcUrl);
  const sequence = await client.getSequence(account.address);
  const chainId = await client.getChainId();

  const transaction = {
    signerData: {
      accountNumber: `${sequence.accountNumber}`,
      sequence,
      chainId,
    },
    fee: {
      amount: [
        {
          denom: 'uatom',
          amount: '10000',
        },
      ],
      gas: '180000', // 180k
    },
    memo: '',
    msgs: [
      {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: account.address,
          toAddress: RECEIVER_ADDRESS.COSMOS,
          amount: [{ denom: 'uatom', amount: '10000' }],
        },
      },
    ],
    sequence: `${sequence}`,
  };

  /* create signDoc */
  const txBodyBytes = getTxBodyBytes(transaction);
  const authInfoBytes = getAuthInfoBytes(transaction, account);

  const signDoc = makeSignDoc(
    txBodyBytes,
    authInfoBytes,
    transaction.signerData.chainId,
    Number(transaction.signerData.accountNumber),
  );

  /* serialized singDoc */

  const uint8SignDoc = makeSignBytes(signDoc);
  const serializedTx = Buffer.from(uint8SignDoc).toString('hex');

  return {
    unSignedTx: signDoc,
    serializedTx,
  };
};
