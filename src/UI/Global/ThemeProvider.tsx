"use client";
import React, { JSX } from "react";
import { ThemeProvider as Provider } from "styled-components";
import { theme } from "./theme";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element {
  return <Provider theme={theme}>{children}</Provider>;
}
