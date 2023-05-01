export const createSuiSignedTx = ({ unSignedTx, signature }) => {
  return [
    Buffer.from(unSignedTx).toString('base64'),
    [Buffer.from(signature.slice(2), 'hex').toString('base64')],
  ];
};
