/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import { TonClient4, WalletContractV4 } from 'ton';
import { sign } from 'ton-crypto';

import { beginCell, storeMessageRelaxed, SendMode, internal } from 'ton-core';
import { CHAIN, Ton } from '@dsrv/kms';
import { getTonPrivateKey } from '../getPrivateKey';

export const tonSdkSignedTx = async (mnemonic: string) => {
  // Create Client
  const client = new TonClient4({
    endpoint: 'https://testnet-v4.tonhubapi.com',
  });

  const keypair = Ton.getKeyPair({ mnemonic, path: { type: CHAIN.TON, account: 0, index: 0 } });

  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: Buffer.from(keypair.publicKey),
  });

  const contract = client.open(wallet);

  const seqno: number = await contract.getSeqno();

  const messages = [
    internal({
      to: 'EQDk-lcDdEmTB2Q_71ssGSnGn9Dr_ouAMVbEPsrafj12bjEn',
      value: '0.001',
      body: 'Hello world: 1',
    }),
    internal({
      to: 'EQDk-lcDdEmTB2Q_71ssGSnGn9Dr_ouAMVbEPsrafj12bjEn',
      value: '0.17',
      body: 'Hello world: 2',
    }),
  ];

  const workchain = 0;
  const walletId = 698983191 + workchain;
  const sendMode = SendMode.PAY_GAS_SEPARATLY;

  const transaction = beginCell().storeUint(walletId, 32);

  if (seqno === 0) {
    for (let i = 0; i < 32; i++) {
      transaction.storeBit(1);
    }
  } else {
    transaction.storeUint(Math.floor(Date.now() / 1e3) + 60, 32);
  }
  transaction.storeUint(seqno, 32);
  transaction.storeUint(0, 8); // Simple order
  for (const m of messages) {
    transaction.storeUint(sendMode, 8);
    transaction.storeRef(beginCell().store(storeMessageRelaxed(m)));
  }

  const realTx = transaction.endCell().hash();

  // sdk sign method
  const signature = sign(realTx, Buffer.from(keypair.secretKey));

  return `0x${signature.toString('hex')}`;
};
