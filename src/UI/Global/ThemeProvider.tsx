"use client";
import React, { JSX } from "react";
import { ThemeProvider as Provider } from "styled-components";
import { theme } from "./theme";
import { GlobalStyles } from "./GlobalStyles";
import { Normalise } from "./Normalise";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element {
  return (
    <Provider theme={theme}>
      <GlobalStyles />
      <Normalise />
      {children}
    </Provider>
  );
}
