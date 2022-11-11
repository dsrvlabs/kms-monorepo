import { Ethereum, CHAIN } from '@dsrv/kms';
import { getEthereumOfflineTx } from '../getTx';
import { ethereumSdkSignedTx } from '../sdkSignedTx';

export const getEthereumSignature = async (mnemonic: string) => {
  const ethereumSdkSignature = await ethereumSdkSignedTx(mnemonic);
  const { serializedTx } = await getEthereumOfflineTx(mnemonic);
  const ethereumSignature = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    },
    serializedTx,
  );
  return {
    ethereumSdkSignature,
    signature: ethereumSignature.signature,
  };
};
