# @dsrv/kms

dsrv key management store

## Usage

```javascript
// [next.config.js](https://github.com/antelle/argon2-browser/issues/26)
config.module.rules.push({ test: /\.wasm$/, loaders: ['base64-loader'], type: 'javascript/auto' });
```

```javascript
import { KMS, CHAIN, createKeyStore } from '@dsrv/kms';

// create key store
const mnemonic = '....';
const password = 'strong password';
const keyStore = await createKeyStore(mnemonic.split(' '), password);

/*
{
  t: 9,
  m: 262144,
  s: '89aaLUkbh3E3yvBvatitUsmznTMd2p7jU1cri5D5xBnu',
  j: [
    'eyJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUEJFUzItSFMyNTYrQTEyOEtXIiwia2lkIjoiT1lBd0hGRW4zYmFKSWJkLXoyc09VMFhnRjVLRmtfb2ZBeWQwWmxMM0FjMCIsInAycyI6IlBqNHpCdS1aMC1laVVPcGx5emh5dXciLCJwMmMiOjgxOTJ9',
    'A7jjx9G1jwylhRqmk9WLgc29_G_0Bn36buUSXC1u6zRq0jLzAEKOpg',
    '9COzNxXnCc_T1Jtg',
    'VD5EXQ',
    'BboSFxRBdGQlNyHqG8hOxw'
  ]
}
*/

// get account
const kms = new KMS({
  keyStore,
  transport: null,
});
const account = await kms.getAccount({
  type: CHAIN.MINA,
  account: 0,
  index: 0,
  password,
});

/*
B62qpgyAmA5yNgY4buNhTxTKYTvkqSFf442KkHzYHribCFjDmXcfHHm
*/
```

## Test keysore

1. yarn build:kms
2. add packages/examples/mnemonic.json
3. modify packages/examples/mnemonic.json
4. yarn test keystore
5. yarn test keystore/solana
6. yarn test keystore/near

## Test ledger nano s, nano x

1. yarn build:kms
2. yarn test ledger/cosmos
3. yarn test ledger/near
4. yarn test ledger/solana
