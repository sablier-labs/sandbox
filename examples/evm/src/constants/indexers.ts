import { getExperimentalURL } from "@sablier/indexers";

export const INDEXER_THE_GRAPH = getExperimentalURL({ vendor: "graph", protocol: "lockup" });
export const INDEXER_ENVIO = getExperimentalURL({ vendor: "envio", protocol: "flow" });
