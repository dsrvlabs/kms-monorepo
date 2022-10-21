import { ethers } from 'ethers';
import { RECEIVER_ADDRESS } from '../../constants';

export const getEthereumTx = () => {
  const transactionParameters = {
    to: RECEIVER_ADDRESS.ETHEREUM,
    value: ethers.utils.parseEther('0.0005'),
    gasLimit: 8000000,
    gasPrice: '0x07f9acf02',
    type: 2,
    nonce: 5,
    // goerli network
    chainId: 5,
    // // EIP-1559; Type 2
    maxPriorityFeePerGas: '0x07f9acf02',
    maxFeePerGas: '0x07f9acf02',
  };

  return {
    serializedTx: ethers.utils.serializeTransaction(transactionParameters),
    unSignedTx: transactionParameters,
  };
};
