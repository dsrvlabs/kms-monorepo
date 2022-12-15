import { createKeyStore, getMnemonic } from '../src/argon2';
import { CHAIN } from '../src/types';
import { Aptos } from '../src/blockchains/aptos';
import { Cosmos } from '../src/blockchains/cosmos';
import { Ethereum } from '../src/blockchains/ethereum';
import { Eth2 } from '../src/blockchains/eth2';
import { Near } from '../src/blockchains/near';
import { Solana } from '../src/blockchains/solana';
import { Sui } from '../src/blockchains/sui';
import { Ton } from '../src/blockchains/ton';

const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
const password = 'strong password';
const message = 'Hello, world!';

// const mnemonicForTon = 'recall, casino, puppy give remind umbrella month zoo car basket current system maze medal skate property ocean inform indicate pink address timber fall diesel'
test('Ton - getAccount', async () => {
  // EQBKZ5-jt1v36P1TQVrsXtt3g2bkbOBi7ic6exjvoWMsLe5A
  expect(
    await Ton.getAccount({
      mnemonic: mnemonic,
      path: { type: CHAIN.TON, account: 0, index: 0 },
    }),
  ).toEqual({
    address: 'EQBKZ5-jt1v36P1TQVrsXtt3g2bkbOBi7ic6exjvoWMsLe5A',
    publicKey: '7MYDnB9nziAErTYRc7owGARuko7TCHARSqUGZQtRZQv',
  });
});

test('Ton - signTx', () => {
  expect(
    Ton.signTx(
      {
        mnemonic,
        path: { type: CHAIN.TON, account: 0, index: 0 },
      },
      '0x68656c6c6f20776f726c6421',
    ),
  ).toEqual({
    signature:
      '0x2d5949b824ee80d559ff028a0bba7d133fab0179cdbb0550c217bdcfe574383bad4a3b2742d747b1d554faf3af115c9a910b7ef79d662a1bc48a81f05a4ba700',
    unsignedTx: '0x68656c6c6f20776f726c6421',
  });
});

test('Ton - signMsg', () => {
  expect(
    Ton.signMsg(
      {
        mnemonic,
        path: { type: CHAIN.TON, account: 0, index: 0 },
      },
      message,
    ),
  ).toEqual({
    signature:
      '0x5e9d6b44bda5b2374d51ca52cebf3f9e68dd7186574ed539df9826432bc43c187786c5525f9f4285e2ac15dfc7196b751997b3200e1bdbdb9de56d8b4e52c70b',
    message: message,
  });
});

test('Argon2', async () => {
  const keystore = await createKeyStore(mnemonic.split(' '), password);
  const result = keystore && (await getMnemonic(password, keystore));

  expect(result).toEqual(mnemonic);
});

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

test('Cosmos - signTx', () => {
  const unsignedTx =
    '0x0a91010a8e010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e64126e0a2d636f736d6f733134326a397535656164757a64376661756d796775643672756864776d65393871737932656b6e122d636f736d6f733134326a397535656164757a64376661756d796775643672756864776d65393871737932656b6e1a0e0a057561746f6d1205313030303012680a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a2103c156c16c456788349d1cd306a681dcf408cd3a4a121eb18396ed5be59b9b837012040a020801180112140a0e0a057561746f6d1205313030303010a0fe0a1a0b636f736d6f736875622d34';
  expect(
    Cosmos.signTx(
      {
        mnemonic,
        path: { type: CHAIN.COSMOS, account: 0, index: 0 },
      },
      unsignedTx,
    ),
  ).toEqual({
    unsignedTx,
    signature:
      '0x70a03cb9a3cb98353bc0cb8f68eeef1d3d6ad7111f0c5eae92c5b2c3947edbac474ec0e7eee920539eba02a5e9dab879ff06de8bf512cfdfe257bb73a0f49b7b',
  });
});

test('Injective - getAccount (60)', () => {
  expect(
    Ethereum.getAccount(
      {
        mnemonic,
        path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
      },
      { prefix: 'inj' },
    ),
  ).toEqual({
    address: 'inj13u6g7vqgw074mgmf2ze2cadzvkz9snlwcrtq8a',
    publicKey: '0x035a0c6b83b8bd9827e507270cadb499b7e3a9095246f6a2213281f783d877c98b',
  });
});

test('Injective - getAccount (118)', () => {
  expect(
    Cosmos.getAccount(
      {
        mnemonic,
        path: { type: CHAIN.COSMOS, account: 0, index: 0 },
      },
      { prefix: 'inj' },
    ),
  ).toEqual({
    address: 'inj1seqzn42dm7q3l7amgfswdheuhyvwwegqh2w8v0',
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

test('Ethereum - signTx (Legacy)', () => {
  /*
    nonce: 2,
    gasLimit: 3,
    gasPrice: 4,
    to: "0x0000000000000000000000000000000000000000",
    value: 5,
    chainId: 1,
  */
  const unsignedTx = '0xdd0204039400000000000000000000000000000000000000000580018080';
  expect(
    Ethereum.signTx(
      {
        mnemonic,
        path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
      },
      unsignedTx,
    ),
  ).toEqual({
    unsignedTx,
    signature:
      '0x54a9cf09e052c29852b125a87ca01c06d0ff5597c081e129360bcd19e81d334d58c60edf5391d60915fab43e14303dc2fc2b89d48b22fa3cbbebe3567931be7c01',
  });
});

test('Ethereum - signTx (Celo)', () => {
  /*
    nonce: 1,
    gasPrice: 2,
    gasLimit: 3,
    feeCurrency: "0x0000000000000000000000000000000000000000",
    to: "0x0000000000000000000000000000000000000000",
    value: 4,
    chainId: 44787,
  */
  const unsignedTx =
    '0xf60102039400000000000000000000000000000000000000008080940000000000000000000000000000000000000000048082aef38080';
  expect(
    Ethereum.signTx(
      {
        mnemonic,
        path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
      },
      unsignedTx,
    ),
  ).toEqual({
    unsignedTx,
    signature:
      '0x525492a0ba9f1866f30a007cd456dc788a0595dc4638291af6fa81a5db945bbe10cd49df621bf0edd53266ec74a7b26a5a5862cabe4c6be3bdda74552302f6e100',
  });
});

test('Ethereum - signTx (Eip1559)', () => {
  /*
  nonce: 1,
  gasLimit: 2,
  maxFeePerGas: 4,
  maxPriorityFeePerGas: 3,
  to: "0x0000000000000000000000000000000000000000",
  value: 5,
  chainId: 1,
  */
  const unsignedTx = '0x02dd01010304029400000000000000000000000000000000000000000580c0';
  expect(
    Ethereum.signTx(
      {
        mnemonic,
        path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
      },
      unsignedTx,
    ),
  ).toEqual({
    unsignedTx,
    signature:
      '0x8b6e5c3e894e6d8c9833d7ee40cc9674e6a1c886caf14ae5108a57bfd5c9a9bd724cc84f71d2e8603aea2c927336878b42d14d455fe02cb8a95eecb2fa04c98e01',
  });
});

test('Ethereum - signTx (Eip2930)', () => {
  /*
    nonce: 9,
    gasPrice: 2,
    gasLimit: 3,
    accessList: [
      {
        address: "0x0000000000000000000000000000000000000000",
        storageKeys: [
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        ],
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        storageKeys: [],
      },
    ],
    to: "0x0000000000000000000000000000000000000000",
    value: 3,
    chainId: 1,
  */
  const unsignedTx =
    '0x01f86c010902039400000000000000000000000000000000000000000380f84ff7940000000000000000000000000000000000000000e1a00000000000000000000000000000000000000000000000000000000000000000d6940000000000000000000000000000000000000000c0';
  expect(
    Ethereum.signTx(
      {
        mnemonic,
        path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
      },
      unsignedTx,
    ),
  ).toEqual({
    unsignedTx,
    signature:
      '0x1eb1cb45dcad7c4fa882f8c92fe117dafccbf86c318bbffb1e8a0adf0cbae198694eb5083f931034b5cbdbc9e272dd8f469e222fa1ee01beba7ff3d4239ac2cd00',
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

test('Near - signMsg', () => {
  const account = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 0 },
  });
  expect(
    Near.signMsg(
      {
        mnemonic,
        path: { type: CHAIN.NEAR, account: 0, index: 0 },
      },
      message,
    ),
  ).toEqual({
    message,
    signature:
      '0x3063c38d42c1071323c067dc05b245eb63e5f136c09b6291130e394988318136f2eb090c3788feb66ce526001343cf729d767bba8a6efa90179c7cc61ab9890e',
    publicKey: account.publicKey,
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

test('Solana - signMsg', () => {
  const account = Solana.getAccount({
    mnemonic,
    path: { type: CHAIN.SOLANA, account: 0, index: 0 },
  });
  expect(
    Solana.signMsg(
      {
        mnemonic,
        path: { type: CHAIN.SOLANA, account: 0, index: 0 },
      },
      message,
    ),
  ).toEqual({
    message,
    signature:
      '0x6f0512ed8eb1e8bb8cef5fca8cb243629c367e4f0e8744e172b0052a3567fd7e8d155b4dcf96c304233f4e6cfbd1743ead5bf07673ecb56ec8231c5429c88b0d',
    publicKey: account.publicKey,
  });
});

test('Solana - signTx', () => {
  const unsignedTx =
    '0x010001023d2b0d21b0b91cd177ce4b45bb27333e19134952d02212adb035f2df6066c3bc00000000000000000000000000000000000000000000000000000000000000008993a412697f26c4b0aecafbb534318cd9c6d41f3bbe8dab424beeb5750e1bdd01010200000c0200000000e1f50500000000';
  expect(
    Solana.signTx(
      {
        mnemonic,
        path: { type: CHAIN.SOLANA, account: 0, index: 0 },
      },
      unsignedTx,
    ),
  ).toEqual({
    unsignedTx,
    signature:
      '0xc61c125ab311d183583b172733ab68cd2479e10cc9fa5e965317c69ab9962a3e28375c9dd35cc77c78159c54b7a4542fc12ecc9180b7dbb26bd739e2430e7b0a',
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
