import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html {
    font-size: 10px;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }


  body {
    font-size: 1.6rem;
    font-family: ${({ theme }) => theme.bodyFont};
    color: ${({ theme }) => theme.green};
  }
`;
