import { beginCell } from 'ton-core';

export const createTonSignedTx = ({ unSignedTx, signature }) => {
  const signedTx = beginCell()
    .storeBuffer(Buffer.from(signature.replace('0x', ''), 'hex'))
    .storeBuilder(unSignedTx)
    .endCell();

  return signedTx;
};
