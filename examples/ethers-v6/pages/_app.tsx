import { PropsWithChildren } from "react";
import BigNumber from "bignumber.js";
import "cross-fetch";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "../src/components/Theme";
import Web3Provider from "../src/components/Web3";

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

function Wrapper({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  );
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Wrapper>
      <Head>
        <title>Sablier Sandbox | Ethers v6</title>
      </Head>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default App;
