import Transport from "@ledgerhq/hw-transport";
import { CHAIN, Account, BIP44, SignedTx, SignedMsg, Message } from "./types";
import { LEDGER as eth } from "./blockchains/ethereum/ledger";
import { LEDGER as terra } from "./blockchains/cosmos/ledger/terra";
import { LEDGER as flow } from "./blockchains/flow/ledger";
import { LEDGER as solana } from "./blockchains/solana/ledger";
import { LEDGER as near } from "./blockchains/near/ledger";
import { LEDGER as kusama } from "./blockchains/kusama/ledger";
import { LEDGER as polkadot } from "./blockchains/polkadot/ledger";
import { LEDGER as cosmos } from "./blockchains/cosmos/ledger/cosmos";
import { LEDGER as tezos } from "./blockchains/tezos/ledger";

export async function getAccountFromLedger(
  path: BIP44,
  transport: Transport
): Promise<Account | null> {
  try {
    switch (path.type) {
      /*
      case CHAIN.DSRV: {
        const publicKey = await cosmos.getAccount(path, transport, "dsrv");
        return publicKey;
      }
      */
      // blockchains
      case CHAIN.COSMOS: {
        const account = await cosmos.getAccount(
          path,
          transport,
          path.prefix || "cosmos"
        );
        return account;
      }
      case CHAIN.PERSISTENCE: {
        const account = await cosmos.getAccount(path, transport, "persistence");
        return account;
      }
      case CHAIN.AGORIC: {
        const account = await cosmos.getAccount(path, transport, "agoric");
        return account;
      }
      case CHAIN.TERRA: {
        const account = await terra.getAccount(path, transport);
        return account;
      }
      case CHAIN.FLOW: {
        const account = await flow.getAccount(path, transport);
        return account;
      }
      case CHAIN.SOLANA: {
        const account = await solana.getAccount(path, transport);
        return account;
      }
      case CHAIN.NEAR: {
        const account = await near.getAccount(path, transport);
        return account;
      }
      case CHAIN.KUSAMA: {
        const account = await kusama.getAccount(path, transport);
        return account;
      }
      case CHAIN.POLKADOT: {
        const account = await polkadot.getAccount(path, transport);
        return account;
      }
      case CHAIN.TEZOS: {
        const account = await tezos.getAccount(path, transport);
        return account;
      }
      case CHAIN.ETHEREUM:
      case CHAIN.CELO: {
        const account = eth.getAccount(path, transport);
        return account;
      }
      // add blockchains....
      // blockchains
      default:
        break;
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
}

export async function signTxFromLedger(
  path: BIP44,
  transport: Transport,
  unsignedTx: string
): Promise<SignedTx> {
  try {
    switch (path.type) {
      /*
      case CHAIN.DSRV: {
        const response = await cosmos.signTx(path, transport, rawTx);
        return { ...response };
      }
      */
      // blockchains
      case CHAIN.COSMOS: {
        const response = await cosmos.signTx(
          path,
          transport,
          unsignedTx,
          "cosmos"
        );
        return { ...response };
      }
      case CHAIN.PERSISTENCE: {
        const response = await cosmos.signTx(
          path,
          transport,
          unsignedTx,
          "persistence"
        );
        return { ...response };
      }
      case CHAIN.TERRA: {
        const response = await terra.signTx(path, transport, unsignedTx);
        return { ...response };
      }
      case CHAIN.NEAR: {
        const response = await near.signTx(path, transport, unsignedTx);
        return { ...response };
      }
      case CHAIN.SOLANA: {
        const response = await solana.signTx(path, transport, unsignedTx);
        return { ...response };
      }
      case CHAIN.ETHEREUM:
      case CHAIN.CELO: {
        const response = await eth.signTx(path, transport, unsignedTx);
        return { ...response };
      }
      // add blockchains....
      // blockchains
      default:
        break;
    }
    return {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return {};
  }
}

export async function signMsgFromLedger(
  path: BIP44,
  _transport: Transport,
  msg: Message
): Promise<SignedMsg> {
  try {
    switch (path.type) {
      // blockchains
      // add blockchains....
      // blockchains
      default:
        break;
    }
    return { msg };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return { msg };
  }
}
