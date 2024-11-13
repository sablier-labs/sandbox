import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  border-radius: 6px;
  border: 2px solid ${(props) => props.theme.colors.dark300};
  background-color: ${(props) => props.theme.colors.dark050};

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Tab = styled(Link)`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  text-decoration: none;

  & > p {
    width: 100%;
    max-width: calc(100% - 8px);
    text-align: center;
    font-weight: 600;
    padding: 10px;
    border-radius: 4px;
    text-decoration: none;
  }

  &[data-active="true"] {
    & > p {
      background-color: ${(props) => props.theme.colors.dark200};
      color: ${(props) => props.theme.colors.white};
    }
  }

  &:not([data-active="true"]) {
    cursor: pointer;
    &:hover,
    &:active {
      p {
        background-color: ${(props) => props.theme.colors.dark200};
        color: ${(props) => props.theme.colors.white};
      }
    }
  }
`;

const Tabs = styled.div`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.dark300};
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 12px;
`;

function Navigation() {
  const router = useRouter();

  return (
    <Wrapper>
      <Tabs>
        <Tab href={"/"} data-active={router.pathname === "/"}>
          <p>Transactions</p>
        </Tab>
        <Tab href={"/queries"} data-active={router.pathname === "/queries"}>
          <p>Queries</p>
        </Tab>
      </Tabs>
    </Wrapper>
  );
}

export default Navigation;
