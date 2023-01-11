import { Ton, CHAIN } from '@dsrv/kms';
import { TonClient4, WalletContractV4 } from 'ton';
import { beginCell, external, storeMessage } from 'ton-core';

export const sendTonTransaction = async (signedTx, mnemonic) => {
  // Create Client
  const client = new TonClient4({
    endpoint: 'https://testnet-v4.tonhubapi.com',
  });
  // Create wallet contract
  const keypair = Ton.getKeyPair({ mnemonic, path: { type: CHAIN.TON, account: 0, index: 0 } });
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: Buffer.from(keypair.publicKey),
  });
  const contract = client.open(wallet);

  const ext = external({
    to: 'EQDk-lcDdEmTB2Q_71ssGSnGn9Dr_ouAMVbEPsrafj12bjEn',
    init: { code: contract.init.code, data: contract.init.data },
    body: signedTx,
  });
  const extBoc = beginCell().store(storeMessage(ext)).endCell().toBoc().toString('base64');

  // send transaction
  const response = await fetch('https://testnet.toncenter.com/api/v2/jsonRPC', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'sendBoc',
      params: {
        boc: extBoc,
      },
      id: 'string',
      jsonrpc: '2.0',
    }),
  });

  const result = await response.json();

  return result;
};
