import { CHAIN, Sui } from '@dsrv/kms';
import { getSuiTx } from '../getTx';
import { suiSdkSignedTx } from '../sdkSignedTx/suiSdkSignedTx';

export const getSuiSignature = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getSuiTx(mnemonic);

  const { signature } = Sui.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SUI, account: 0, index: 0 },
    },
    serializedTx,
  );

  const suiSdkSignature = await suiSdkSignedTx(mnemonic, unSignedTx);

  return {
    signature,
    suiSdkSignature,
  };
};
