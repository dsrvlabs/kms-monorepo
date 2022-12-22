/* eslint-disable no-undef */

import { CHAIN, Aptos, Cosmos, Ethereum, Eth2, Near, Solana, Sui } from '@dsrv/kms';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
// const password = 'strong password';

test('Aptos - getAccount', () => {
  expect(
    Aptos.getAccount({
      mnemonic,
      path: { type: CHAIN.APTOS, account: 0, index: 0 },
    }),
  ).toEqual({
    address: '0x07968dab936c1bad187c60ce4082f307d030d780e91e694ae03aef16aba73f30',
    publicKey: '0xea526ba1710343d953461ff68641f1b7df5f23b9042ffa2d2a798d3adb3f3d6c',
  });
});

test('ethereum - getAccount', () => {
  expect(
    Ethereum.getAccount({
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    }),
  ).toEqual({
    address: '0x8f348f300873fd5da36950b2ac75a26584584fee',
    publicKey: '0x035a0c6b83b8bd9827e507270cadb499b7e3a9095246f6a2213281f783d877c98b',
  });
});

test('Cosmos - getAccount', () => {
  expect(
    Cosmos.getAccount({
      mnemonic,
      path: { type: CHAIN.COSMOS, account: 0, index: 0 },
    }),
  ).toEqual({
    address: 'cosmos142j9u5eaduzd7faumygud6ruhdwme98qsy2ekn',
    publicKey: '0x03c156c16c456788349d1cd306a681dcf408cd3a4a121eb18396ed5be59b9b8370',
  });
});

test('Ethereum - getAccount', () => {
  expect(
    Ethereum.getAccount({
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    }),
  ).toEqual({
    address: '0x8f348f300873fd5da36950b2ac75a26584584fee',
    publicKey: '0x035a0c6b83b8bd9827e507270cadb499b7e3a9095246f6a2213281f783d877c98b',
  });
});

test('Eth2 - getAccount (withdrawal)', () => {
  expect(
    Eth2.getAccount(
      {
        mnemonic,
        path: {
          type: CHAIN.ETHEREUM,
          account: 0,
          index: 0,
        },
      },
      { keyType: 'withdrawal' },
    ),
  ).toEqual({
    address:
      '0xb2b1b76b034615ebc67c4ca8e6b0e65d8d9a9191d0ffd2d6884933d2e001617bfa420ad25d525c88034dfd51f58f6c43',
    publicKey:
      '0xb2b1b76b034615ebc67c4ca8e6b0e65d8d9a9191d0ffd2d6884933d2e001617bfa420ad25d525c88034dfd51f58f6c43',
  });
});

test('Eth2 - getAccount (signing)', () => {
  expect(
    Eth2.getAccount(
      {
        mnemonic,
        path: {
          type: CHAIN.ETHEREUM,
          account: 0,
          index: 0,
        },
      },
      { keyType: 'signing' },
    ),
  ).toEqual({
    address:
      '0xb84d8ea3b5b8b0d7f483c384749291d9993de245c8370466121f8c29f815c45767ca1b732f18dea47a2eef46ac6631d9',
    publicKey:
      '0xb84d8ea3b5b8b0d7f483c384749291d9993de245c8370466121f8c29f815c45767ca1b732f18dea47a2eef46ac6631d9',
  });
});

test('Near - getAccount', () => {
  expect(
    Near.getAccount({
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 0 },
    }),
  ).toEqual({
    address: 'ed25519:D7MfH95uo87g3CFHbC3wuy8YZ8jh8CQa4rA8GT5DPPJF',
    publicKey: 'ed25519:D7MfH95uo87g3CFHbC3wuy8YZ8jh8CQa4rA8GT5DPPJF',
  });
});

test('Solana - getAccount', () => {
  expect(
    Solana.getAccount({
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    }),
  ).toEqual({
    address: '57mwmnV2rFuVDmhiJEjonD7cfuFtcaP9QvYNGfDEWK71',
    publicKey: '57mwmnV2rFuVDmhiJEjonD7cfuFtcaP9QvYNGfDEWK71',
  });
});

test('Sui - getAccount', () => {
  expect(
    Sui.getAccount({
      mnemonic,
      path: { type: CHAIN.SUI, account: 0, index: 0 },
    }),
  ).toEqual({
    address: '0x061ce2b2100a71bb7aa0da98998887ad82597948',
    publicKey: '0x3311e6a19adc1c06a509e5bf464e9d4ecc73039f311ac940bb11896f82fb6533',
  });
});
