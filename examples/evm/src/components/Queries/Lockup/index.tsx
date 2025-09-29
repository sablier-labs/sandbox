import { useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
import _ from "lodash";
import { INDEXER_THE_GRAPH } from "../../../constants";

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
    streams(first: 10, orderBy: subgraphId, orderDirection: desc) {
      id
      tokenId
      subgraphId
      chainId
      alias
      category
      funder
      sender
      recipient
      hash
      timestamp
      depositAmount
      startTime
      endTime
      cliff
      cliffTime
      cliffAmount
      cancelable
      renounceTime
      canceled
      canceledTime
      withdrawnAmount
      transferable
      asset {
        id
        symbol
      }
      contract {
        address
      }
      segments {
        amount
        exponent
        startTime
        endTime
      }
      tranches {
        amount
        timestamp
        startTime
        endTime
      }
    }
  }
`;

const client = new GraphQLClient(INDEXER_THE_GRAPH);

function Lockup() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["the-graph-lockup"],
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
        <label>Lockup: Most recent 10 streams (The Graph)</label>
      </Label>
      <Body>
        {isLoading && <p>Loading streams...</p>}
        {!_.isNil(error) && <Error>{_.toString(error)}</Error>}
        {!_.isNil(streams) && <code>{streams}</code>}
      </Body>
    </Wrapper>
  );
}

export default Lockup;
