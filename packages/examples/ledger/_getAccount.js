const { KMS } = require("../../lib");

exports.getAccount = async function getAccount(transport, type, index) {
  const kms = new KMS({
    keyStore: null,
    transport,
  });

  const account = await kms.getAccount({
    type,
    account: 0,
    index,
  });
  // eslint-disable-next-line no-console
  console.log("account - ", account);
  return account;
};
