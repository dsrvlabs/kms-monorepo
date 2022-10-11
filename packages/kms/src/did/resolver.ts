import {
  DIDDocument,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
} from "did-resolver";
import { pubkeyToAddress } from "@cosmjs/amino";

export function createDidDoc(publicKeyBase64: string): DIDDocument {
  const cosmosAddress = pubkeyToAddress(
    {
      type: "tendermint/PubKeySecp256k1",
      value: publicKeyBase64,
    },
    "dsrv"
  );
  const did = cosmosAddress.replace("dsrv", "did:dsrv:");
  return {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: did,
    verificationMethod: [
      {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        blockchainAccountId: cosmosAddress.replace("dsrv", "cosmos:dsrv:"),
      },
    ],
  };
}

export async function getDidDoc(did: string): Promise<DIDDocument> {
  // TODO: load from api
  return {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: did,
    verificationMethod: [
      {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        blockchainAccountId: did.replace("did:", "cosmos:"),
      },
    ],
  };
}

export function getResolver(): Record<string, DIDResolver> {
  async function dsrv(
    did: string,
    parsed: ParsedDID
  ): Promise<DIDResolutionResult> {
    const regEx = parsed.did.match(/^(did:dsrv:)[a-zA-HJ-NP-Z0-9]{25,39}$/);
    if (!regEx) {
      return {
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: "invalid Did",
          message: `Not a valid ${did}`,
        },
      };
    }

    const didDocument: DIDDocument = await getDidDoc(did);

    return {
      didDocument,
      didDocumentMetadata: {},
      didResolutionMetadata: { contentType: "application/did+ld+json" },
    };
  }

  return { dsrv };
}
