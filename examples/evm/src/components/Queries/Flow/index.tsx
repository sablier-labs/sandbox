import { useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
import _ from "lodash";
import { INDEXER_ENVIO } from "../../../constants";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  gap: 16px;
`;

const Label = styled.div`
  & > label {
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
  }
`;

const Body = styled.div`
  width: 100%;
  & > code {
    width: 100%;
    color: ${(props) => props.theme.colors.white};
    font-weight: 400;
    white-space: pre-wrap;
    line-height: 150%;
    font-size: 10pt;
  }
`;
const Error = styled.p`
  color: ${(props) => props.theme.colors.red};
  margin-top: 16px;
`;

const getStreams = gql/* GraphQL */ `
  query getStreams {
    Stream(limit: 10, order_by: { subgraphId: desc }, distinct_on: [subgraphId]) {
      id
      tokenId
      subgraphId
      category
      chainId
      alias
      creator
      sender
      recipient
      hash
      timestamp
      startTime
      depletionTime
      transferable
      forgivenDebt
      paused
      pausedTime
      voided
      voidedTime
      lastAdjustmentTimestamp
      availableAmount
      ratePerSecond
      depositedAmount
      refundedAmount
      withdrawnAmount
      snapshotAmount
      position
      version
      contract
      asset {
        id
        symbol
      }
    }
  }
`;

const client = new GraphQLClient(INDEXER_ENVIO);

function Flow() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["envio-lockup"],
    queryFn: async () => client.request(getStreams, {}),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  const streams = useMemo(() => {
    try {
      if (!isLoading && !_.isNil(data)) {
        return JSON.stringify(data, null, 2);
      }
    } catch (e) {
      console.error(e);
      return _.toString(e);
    }

    return undefined;
  }, [data, isLoading]);

  return (
    <Wrapper>
      <Label>
        <label>Flow: Most recent 10 streams (Envio)</label>
      </Label>
      <Body>
        {isLoading && <p>Loading streams...</p>}
        {!_.isNil(error) && <Error>{_.toString(error)}</Error>}
        {!_.isNil(streams) && <code>{streams}</code>}
      </Body>
    </Wrapper>
  );
}

export default Flow;
