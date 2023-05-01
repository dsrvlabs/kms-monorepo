import { TransactionBlock } from '@mysten/sui.js';
import { getSuiAccount } from '../getAccount';

export const SUI_RPC = 'https://wallet-rpc.devnet.sui.io/';

async function request(method, params) {
  const res = await fetch(SUI_RPC, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 0,
      jsonrpc: '2.0',
      method,
      params: params || [],
    }),
  });

  const { result } = await res.json();
  return result;
}

export const suiProvider = {
  provider: {
    getReferenceGasPrice: async () => {
      const result = await request('suix_getReferenceGasPrice', []);
      return result;
    },
    getCoins: async ({ owner, coinType }) => {
      const result = await request('suix_getCoins', [owner, coinType]);
      return result;
    },
    multiGetObjects: async ({ ids, options }) => {
      const result = await request('sui_multiGetObjects', [ids, options]);
      return result;
    },
    dryRunTransactionBlock: async ({ transactionBlock }) => {
      const result = await request('sui_dryRunTransactionBlock', [
        typeof transactionBlock === 'string'
          ? transactionBlock
          : Buffer.from(transactionBlock).toString('base64'),
      ]);
      return result;
    },
  },
};

export const getSuiTx = async (mnemonic: string) => {
  const { address } = getSuiAccount(mnemonic);

  const coins = await request('suix_getCoins', [address]);

  const coinType = '0x2::sui::SUI';
  const filtered = coins.data.filter((item) => item.coinType === coinType);

  const txb = new TransactionBlock();
  txb.setSender(address);

  txb.setGasPayment(
    filtered.map((item) => {
      return {
        objectId: item.coinObjectId,
        version: item.version,
        digest: item.digest,
      };
    }),
  );
  const [coin] = txb.splitCoins(txb.gas, [txb.pure(10000000)]);

  txb.transferObjects([coin], txb.pure(address));
  const transactionBlock = await txb.build(suiProvider as any);

  return {
    unSignedTx: transactionBlock,
    serializedTx: `0x${Buffer.from(transactionBlock).toString('hex')}`,
  };
};
