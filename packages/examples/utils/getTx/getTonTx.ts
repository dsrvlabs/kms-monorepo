/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import { CHAIN, Ton } from '@dsrv/kms';
import { TonClient4, WalletContractV4 } from 'ton';
import { beginCell, storeMessageRelaxed, SendMode, internal } from 'ton-core';

export const getTonTx = async (mnemonic: string) => {
  // Create Client
  const client = new TonClient4({
    endpoint: 'https://testnet-v4.tonhubapi.com',
  });

  // Create wallet contract
  // const { publicKey } = getTonAccount(mnemonic);
  const keypair = Ton.getKeyPair({ mnemonic, path: { type: CHAIN.TON, account: 0, index: 0 } });
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: Buffer.from(keypair.publicKey),
  });
  const contract = client.open(wallet);

  // Create a transfer
  const seqno: number = await contract.getSeqno();

  // createWalletTransferV4 https://github.com/ton-community/ton/blob/HEAD/src/wallets/signing/createWalletTransfer.ts#L140
  const messages = [
    internal({
      to: 'EQDk-lcDdEmTB2Q_71ssGSnGn9Dr_ouAMVbEPsrafj12bjEn',
      value: '0.1',
      body: 'Hello world: 1',
    }),
    internal({
      to: 'EQDk-lcDdEmTB2Q_71ssGSnGn9Dr_ouAMVbEPsrafj12bjEn',
      value: '0.1',
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

  const unSignedTx = transaction.endCell().hash();
  const serializedTx = `0x${unSignedTx.toString('hex')}`;

  return {
    unSignedTx: transaction,
    serializedTx,
  };
};
