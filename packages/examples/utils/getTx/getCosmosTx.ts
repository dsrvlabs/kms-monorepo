/* eslint-disable no-unused-vars */
import {
  Registry,
  makeAuthInfoBytes,
  makeSignDoc,
  encodePubkey,
  makeSignBytes,
  DirectSecp256k1HdWallet,
  TxBodyEncodeObject,
} from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino';
import { Int53 } from '@cosmjs/math';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { StargateClient, defaultRegistryTypes } from '@cosmjs/stargate';
import { RPC_URL, RECEIVER_ADDRESS } from '../../constants';

const getTxBodyBytes = (transaction) => {
  const registry = new Registry(defaultRegistryTypes);

  const txBodyEncodeObject: TxBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: {
      messages: transaction.msgs,
      memo: transaction.memo,
    },
  };

  const txBodyBytes = registry.encode(txBodyEncodeObject);
  return txBodyBytes;
};

const getAuthInfoBytes = (transaction, pubkey) => {
  const gasLimit = Int53.fromString(transaction.fee.gas).toNumber();
  const authInfoBytes = makeAuthInfoBytes(
    [
      {
        pubkey: encodePubkey(encodeSecp256k1Pubkey(pubkey)),
        sequence: transaction.signerData.sequence,
      },
    ],
    transaction.fee.amount,
    gasLimit,
    undefined,
    undefined,
    // 1,
  );

  return authInfoBytes;
};

export const getCosmosTx = async (mnemonic: string) => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const [{ address, pubkey }] = await wallet.getAccounts();
  /* create transaction */
  const rpcUrl = RPC_URL.COSMOS;
  const client = await StargateClient.connect(rpcUrl);
  const sequence = await client.getSequence(address);
  const chainId = await client.getChainId();

  const transaction = {
    signerData: {
      accountNumber: sequence.accountNumber,
      sequence: sequence.sequence,
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
    memo: 'dsrv/kms',
    msgs: [
      {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: address,
          toAddress: RECEIVER_ADDRESS.COSMOS,
          amount: [{ denom: 'uatom', amount: '10000' }],
        },
      },
    ],
    sequence: sequence.sequence,
  };

  /* create signDoc */
  const txBodyBytes = getTxBodyBytes(transaction);
  const authInfoBytes = getAuthInfoBytes(transaction, pubkey);

  const signDoc = makeSignDoc(
    txBodyBytes,
    authInfoBytes,
    transaction.signerData.chainId,
    Number(transaction.signerData.accountNumber),
  );

  /* serialized singDoc */

  const uint8SignDoc = makeSignBytes(signDoc);
  const serializedTx = `0x${Buffer.from(uint8SignDoc).toString('hex')}`;

  return {
    unSignedTx: signDoc,
    serializedTx,
  };
};

export const getCosmosOfflineTx = async (mnemonic: string) => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const [{ address, pubkey }] = await wallet.getAccounts();
  /* create transaction */
  const rpcUrl = RPC_URL.COSMOS;
  const client = await StargateClient.connect(rpcUrl);
  const chainId = await client.getChainId();

  const transaction = {
    signerData: {
      accountNumber: 1,
      sequence: 2,
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
    memo: 'dsrv/kms',
    msgs: [
      {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: address,
          toAddress: RECEIVER_ADDRESS.COSMOS,
          amount: [{ denom: 'uatom', amount: '10000' }],
        },
      },
    ],
    sequence: 2,
  };

  /* create signDoc */
  const txBodyBytes = getTxBodyBytes(transaction);
  const authInfoBytes = getAuthInfoBytes(transaction, pubkey);

  const signDoc = makeSignDoc(
    txBodyBytes,
    authInfoBytes,
    transaction.signerData.chainId,
    Number(transaction.signerData.accountNumber),
  );

  /* serialized singDoc */

  const uint8SignDoc = makeSignBytes(signDoc);
  const serializedTx = `0x${Buffer.from(uint8SignDoc).toString('hex')}`;

  return {
    unSignedTx: signDoc,
    serializedTx,
  };
};
