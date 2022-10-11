import { ES256KSigner, createJWT, verifyJWT, JWTVerified } from "did-jwt";
import { Resolver, DIDDocument } from "did-resolver";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import { createDidDoc, getResolver } from "./resolver";
import { BIP44 } from "../types";
import { getDerivePath } from "..";

export async function verifyDid(
  jwt: string,
  audience: string
): Promise<JWTVerified | null> {
  try {
    const resolver = new Resolver(getResolver());
    const verified: JWTVerified = await verifyJWT(jwt, {
      resolver,
      audience,
    });
    return verified;
  } catch (error) {
    return null;
  }
}

export async function createDid(
  path: BIP44,
  mnemonic: string,
  name: string
): Promise<string> {
  const seed = mnemonicToSeedSync(mnemonic);
  const node = fromSeed(seed);
  const child = node.derivePath(getDerivePath(path)[0]);

  if (child.privateKey) {
    const signer = ES256KSigner(child.privateKey.toString("hex"));
    const didDocument: DIDDocument = createDidDoc(
      Buffer.from(child.publicKey).toString("base64")
    );
    const issuer = didDocument.id;
    const jwt = await createJWT(
      { ...didDocument, aud: didDocument.id, name },
      { issuer, signer },
      { alg: "ES256K" }
    );
    return jwt;
  }
  return "";
}
