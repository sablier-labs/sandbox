import { getIndexerEnvio } from "@sablier/indexers";
import { SEPOLIA } from "./sablier";

const envio = getIndexerEnvio({ chainId: SEPOLIA.id, indexer: "streams" });
if (!envio) {
  throw new Error(
    `Missing Envio "streams" indexer for chainId ${SEPOLIA.id}. Check @sablier/indexers.`,
  );
}

/** Envio HyperIndex GraphQL endpoint for v4.0 LockupStream entities on Sepolia. */
export const INDEXER_ENDPOINT = envio.endpoint.url;
