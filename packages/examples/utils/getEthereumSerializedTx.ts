import { Account } from '@dsrv/kms/src/types';
import { RECEIVER_ADDRESS } from '../constants';

export const getEthereumSerializedTx = (account: Account) => {
  const transactionParameters = {
    from: account.address,
    to: RECEIVER_ADDRESS.ETHEREUM,
    value: '0x00',
    data: '0x6057361d000000000000000000000000000000000000000000000000000000000008a198',
  };

  return JSON.stringify(transactionParameters);
};
