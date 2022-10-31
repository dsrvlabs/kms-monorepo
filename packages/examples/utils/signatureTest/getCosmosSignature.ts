import { Cosmos } from '@dsrv/kms';
import { CHAIN } from '@dsrv/kms/lib/types';
import { getCosmosOfflineTx } from '../getTx';
import { cosmosSdkSignedTx } from '../sdkSignedTx';

export const getCosmosSignature = async (mnemonic: string) => {
  const cosmosSdkSignature = await cosmosSdkSignedTx(mnemonic);
  const { serializedTx } = await getCosmosOfflineTx(mnemonic);
  const cosmosSignature = Cosmos.signTx(
    {
      mnemonic,
      path: { type: CHAIN.COSMOS, account: 0, index: 0 },
    },
    serializedTx,
  );
  return { cosmosSdkSignature, signature: cosmosSignature.signature };
};
