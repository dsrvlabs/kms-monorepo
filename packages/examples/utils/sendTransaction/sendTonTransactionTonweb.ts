import TonWeb from 'tonweb';
import { Ton, CHAIN } from '@dsrv/kms';
import { getTonAccount } from '../getAccount';

export const sendTonTransactionTonweb = async (mnemonic) => {
  const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
      apiKey: '61860e97bc7f17731dc243874b0b47d20ecd8c7a850f823bb27948b596cfd324',
    }),
  );
  const keyPair = Ton.getKeyPair({
    mnemonic,
    path: { type: CHAIN.TON, account: 0, index: 0 },
  });

  const WalletClass = tonweb.wallet.all.v4R2;
  const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
  });

  const { address } = getTonAccount(mnemonic);

  const toAddress = new TonWeb.utils.Address(address).toString(true, true, false);

  const seqno = await wallet.methods.seqno().call();

  const amount = TonWeb.utils.toNano('0.1');
  const sendMode = 3;

  const transfer = wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    amount,
    toAddress,
    seqno: seqno || 0,
    payload: 'Hello, world',
    sendMode,
  });
  const result = await transfer.send();

  return result;
};
