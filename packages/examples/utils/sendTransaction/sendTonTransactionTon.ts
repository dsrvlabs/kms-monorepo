import { CHAIN, Ton } from '@dsrv/kms';
import { TonClient4, WalletContractV4 } from 'ton';
import { internal } from 'ton-core';

export const sendTonTransactionTon = async (signedTx, mnemonic) => {
  const keypair = Ton.getKeyPair({ mnemonic, path: { type: CHAIN.TON, account: 0, index: 0 } });
  const workchain = 0; // Usually you need a workchain 0
  const wallet = WalletContractV4.create({
    workchain,
    publicKey: Buffer.from(keypair.publicKey),
  });

  const endpoint = 'https://testnet-v4.tonhubapi.com'; // "https://mainnet-v4.tonhubapi.com"; // 'https://testnet-v4.tonhubapi.com';
  const client = new TonClient4({ endpoint });

  const contract = client.open(wallet);

  const seqno = await contract.getSeqno();

  const result = await contract.sendTransfer({
    seqno,
    secretKey: Buffer.from(keypair.secretKey),
    messages: [
      internal({
        to: 'EQDk-lcDdEmTB2Q_71ssGSnGn9Dr_ouAMVbEPsrafj12bjEn',
        value: '0.1',
      }),
    ],
  });
  return result;
};
