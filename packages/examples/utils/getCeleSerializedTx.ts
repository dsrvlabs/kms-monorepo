import { Account } from '@dsrv/kms/src/types';
import { RECEIVER_ADDRESS } from '../constants';

export const getCeloSerializedTx = (account: Account) => {
  const transactionParameters = {
    from: account.address,
    to: RECEIVER_ADDRESS.CELO,
    data: '0x6057361d000000000000000000000000000000000000000000000000000000000008a198',
  };

  return JSON.stringify(transactionParameters);
};
