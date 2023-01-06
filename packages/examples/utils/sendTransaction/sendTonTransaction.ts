import { TonClient4, WalletContractV4 } from 'ton';
import { getTonAccount } from '../getAccount';

export const sendTonTransaction = async (signedTx, mnemonic) => {
  // Create Client
  const client = new TonClient4({
    endpoint: 'https://testnet-v4.tonhubapi.com',
  });
  // Create wallet contract
  const { publicKey } = getTonAccount(mnemonic);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
  const contract = client.open(wallet);

  const res = await contract.send(signedTx);
  return res;
};
