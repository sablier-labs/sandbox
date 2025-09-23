import type { PropsWithChildren } from "react";
import { ThemeProvider as Provider, createGlobalStyle } from "styled-components";
import { Urbanist } from "next/font/google";
import { normalize } from "styled-normalize";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const colors = {
  black: "#000000",
  dark: "#14161F",
  dark050: "#1a1d28",
  dark100: "#1e212f",
  dark200: "#242838",
  dark300: "#2a2e41",
  gray: "#E1E4EA",
  gray200: "#C3C9D5",
  gray300: "#A5AEC0",
  gray400: "#8792AB",
  gray500: "#6A7795",
  green: "#00D395",
  red: "#E52E52",
  blue: "#0063FF",
  orange: "#FF9C00",
  purple: "#874FFF",

  transparent: "transparent",
  white: "#FFFFFF",
};

export type ThemeType = {
  colors: typeof colors;
};

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}

const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
 ${normalize}

 :root {
    --font-urbanist: ${urbanist.style.fontFamily};
  }

  *,
  ::before,
  ::after {
    box-sizing: border-box;
    line-height: 1;
  }

  html {
    ${Object.entries(colors.dark)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join(" ")}
  }

   /** https://makandracards.com/makandra/55801-does-html-or-body-scroll-the-page */

  body{
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: none;
    scroll-behavior: smooth;
  }

  html,
  body {
    min-height: 100vh;
    margin: 0rem;
    padding: 0rem;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.dark200};

    font-family: var(--font-urbanist);
    cursor: auto;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;


    #root, #__next {
      width: 100%;
      overflow: hidden;
    }

    p, span, h1, h2, h3, h4, h5, label{
    margin: 0;
    -webkit-margin-before: 0px;
  }
  }



`;

function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <Provider theme={{ colors }}>
      <GlobalStyle theme={{ colors }} />
      <>{children}</>
    </Provider>
  );
}

export { GlobalStyle, ThemeProvider };
