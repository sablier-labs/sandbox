import styled from "styled-components";
import Account from "../src/components/Account";
import Forms from "../src/components/Forms";
import Navigation from "../src/components/Navigation";

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 48px;
  gap: 48px;
`;

const Disclaimer = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.orange};

  & > p {
    color: ${(props) => props.theme.colors.dark};
  }
`;

function Home() {
  return (
    <Wrapper>
      <Disclaimer>
        <p>The Sablier x Wagmi Sandbox is only available on Sepolia</p>
      </Disclaimer>
      <Container>
        <Navigation />
        <Account />
        <Forms />
      </Container>
    </Wrapper>
  );
}

export default Home;
