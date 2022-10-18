import { Account } from '@dsrv/kms/src/types';

export const getEthereumSerializedTx = (account: Account) => {
  const transactionParameters = {
    from: account.address,
    to: '0x08505F42D5666225d5d73B842dAdB87CCA44d1AE', // allthatnode
    value: '0x00',
    data: '0x6057361d000000000000000000000000000000000000000000000000000000000008a198',
  };

  return JSON.stringify(transactionParameters);
};
