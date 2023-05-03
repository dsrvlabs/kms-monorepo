# @dsrv/kms

> dsrv key management store. @dsrv/kms provides the following methods for Ethereum, Celo, Near, Solana, Cosmos, Aptos, Ton, Sui

## 0. Live Demo

- Through [WELLDONE Docs](https://docs.welldonestudio.io/tutorials/kms/), you may see a live demonstration of kms and a more thorough theoretical foundation.

## 1. getAccount

> Through getAccount method, you can get account of your mnemonic.

```typescript
import { Account, CHAIN, Ethereum } from '@dsrv/kms';

/* Ethereum getAccount */
export const getEthereumAccount = (mnemonic: string): Account => {
  const ethereumAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return ethereumAccount;
};
```

#### A. Returns

```typescript
interface Account {
  address: string;
  publicKey: string;
}
```

#### B. Params

```typescript
typeof mnemonic === string; // "your private mnemonic"
```

#### C. Examples

- By following [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/utils/getAccount/getAccount.ts), you can see the example code.
- You can execute the example code through the command below.

  1. `git clone https://github.com/dsrvlabs/kms-monorepo`
  2. Create the `mnemonic.json` file inside the `packages/examples` (follow the format of [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/mnemonic.example.json))
  3. `yarn && yarn build`
  4. `yarn start:example getAccountPlayground.ts`

## 2. getPrivateKey

> Through getPrivateKey method, you can get a private key of your mnemonic.

```typescript
import { CHAIN, Ethereum } from '@dsrv/kms';

/* Ethereum getPrivateKey */
export const getEthereumPrivateKey = (mnemonic: string): string => {
  const ethereumPrivateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return ethereumPrivateKey;
};
```

#### A. Returns

```typescript
typeof privateKey === string;
```

#### B. Params

```typescript
typeof mnemonic === string; // "your private mnemonic"
```

#### C. Examples

- By following [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/utils/getPrivateKey/getPrivateKey.ts), you can see the example code.
- You can execute the example code through the command below.

  1. `git clone https://github.com/dsrvlabs/kms-monorepo`
  2. Create the `mnemonic.json` file inside the `packages/examples` (follow the format of [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/mnemonic.example.json))
  3. `yarn && yarn build`
  4. `yarn start:example getPrivateKeyPlayground.ts`

## 3. signTx (getSignature)

> Through signTx method, you can get a signature for the transaction.

```typescript
import { CHAIN, Ethereum } from '@dsrv/kms';

const { signature } = Ethereum.signTx(
  {
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  },
  serializedTx, // must be hex string
);
```

#### A. Returns

```typescript
interface SignedTx {
  unsignedTx: string;
  signature: string;
}
```

#### B. Params

```typescript
typeof serializedTx === string; // must be hex string
```

#### C. Useage

Through kms, you can get a signature for the transaction. The steps listed below should be followed in order to sign the transaction through kms.

1. Create raw transactions for each chain using the SDK.
2. To obtain a signature for the transaction, add the created raw transaction as a signTx method factor of kms.
3. The raw transaction is joined with the signature from kms to create a signed transaction.

```typescript
import { Ethereum } from '@dsrv/kms';

export const getEthereumSignedTx = async (mnemonic: string) => {
  // 1. Create raw transactions for each chain using the SDK.
  // getEthereumTx is a custom method created to get raw transaction back.
  const { serializedTx, unSignedTx } = await getEthereumTx(mnemonic);

  // 2. The signature value for transaction is received through the signTx method of kms.
  const ethereumSignature = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    },
    serializedTx,
  );

  // 3.The raw transaction generated above and the signature received through kms are combined to create a signed transaction.
  // createEthereumSignedTx is a custom method for returning signedTransaction by combining signature and raw transaction.
  const ethereumSignedTx = createEthereumSignedTx({
    unSignedTx,
    signature: ethereumSignature.signature,
  });

  return { ethereumSignedTx, signature: ethereumSignature.signature };
};
```

#### D. Example

- By following [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/utils/signTx/signTransaction.ts), you can see the example code.
- You can execute the example code through the command below.

  1. `git clone https://github.com/dsrvlabs/kms-monorepo`
  2. Create the `mnemonic.json` file inside the `packages/examples` (follow the format of [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/mnemonic.example.json))
  3. `yarn && yarn build`
  4. `yarn start:example signTxPlayground.ts`

## 4. sendTransaction

> Transactions can be transferred via the signedTransaction created above. However, a faucet is required to transmit the transaction.

- By following [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/sendTransactionPlayground.ts), you can see the example code.
- You can execute the example code through the command below.

  1. `git clone https://github.com/dsrvlabs/kms-monorepo`
  2. Create the `mnemonic.json` file inside the `packages/examples` (follow the format of [this link](https://github.com/dsrvlabs/kms-monorepo/blob/develop/packages/examples/mnemonic.example.json))
  3. `yarn && yarn build`
  4. `yarn start:example sendTransactionPlayground.ts`

## Test getAccount, signature

1. `yarn && yarn build:kms`
2. `yarn test:examples`
