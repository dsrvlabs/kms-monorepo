import { Account } from '@dsrv/kms/src/types';
import { RECEIVER_ADDRESS, RPC_URL } from '../constants';

const { StargateClient } = require('@cosmjs/stargate');

export const getCosmosSerializedTx = async (account: Account) => {
  const rpcUrl = RPC_URL.COSMOS;
  const client = await StargateClient.connect(rpcUrl);
  const sequence = await client.getSequence(account.address);
  const chainId = await client.getChainId();

  const transactionParameters = {
    signerData: {
      accountNumber: `${sequence.accountNumber}`,
      sequence,
      chainId,
    },
    // { amount: [{ amount: "5000", denom: "uatom" }], gas: "200000" },
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
          fromAddress: account,
          toAddress: RECEIVER_ADDRESS.COSMOS,
          amount: [{ denom: 'uatom', amount: '10000' }],
        },
      },
    ],
    sequence: `${sequence}`,
  };

  return JSON.stringify(transactionParameters);
};
