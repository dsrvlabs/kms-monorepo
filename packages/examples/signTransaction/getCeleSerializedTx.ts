import { Account } from '@dsrv/kms/src/types';

export const getCeloSerializedTx = (account: Account) => {
  const transactionParameters = {
    from: account.address,
    to: '0xb700C3C7DfA7830b7943E2eE9F5e1cC359e5F9eA', // allthatnode
    data: '0x6057361d000000000000000000000000000000000000000000000000000000000008a198',
  };

  return JSON.stringify(transactionParameters);
};
