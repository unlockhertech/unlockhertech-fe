"use client";
import React, { JSX } from "react";
import styled from "styled-components";

interface RowBaseProps {
  $alignItems?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "stretch"
    | "unset"
    | "inherit";
  $flex?: string;
  $flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  $flexWrap?: "wrap" | "no-wrap" | "wrap-reverse";
  $justifyContent?: "space-between" | "center" | "flex-start" | "flex-end";
  $margin?: string;
  $padding?: string;
  $gap?: string;
  $isInline?: boolean;
  style?: { [key: string]: string | number };
  className?: string;
}

interface RowProps {
  alignItems?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "stretch"
    | "unset"
    | "inherit";
  flex?: string;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  flexWrap?: "wrap" | "no-wrap" | "wrap-reverse";
  justifyContent?: "space-between" | "center" | "flex-start" | "flex-end";
  isInline?: boolean;
  margin?: string;
  padding?: string;
  style?: { [key: string]: string | number };
  gap?: string;
  className?: string;
  children: React.ReactNode | Array<React.ReactNode>;
}

const StyledRow = styled.div<RowBaseProps>`
  display: flex;
  width: ${({ $isInline }) => ($isInline ? "auto" : "100%")};
  align-items: ${({ $alignItems }) => $alignItems || "flex-start"};
  flex-direction: ${({ $flexDirection }) => $flexDirection || "row"};
  flex-wrap: ${({ $flexWrap }) => $flexWrap || "wrap"};
  flex: ${({ $flex }) => $flex || "0 1 auto"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "flex-start"};
  margin: ${({ $margin }) => $margin || "0"};
  padding: ${({ $padding }) => $padding || "0"};
  gap: ${({ $gap }) => $gap || "0"};
`;

export function Row({
  alignItems,
  flexDirection,
  flexWrap,
  justifyContent,
  isInline,
  padding,
  margin,
  flex,
  gap,
  ...rest
}: RowProps): JSX.Element {
  return (
    <StyledRow
      $alignItems={alignItems}
      $flexDirection={flexDirection}
      $flexWrap={flexWrap}
      $justifyContent={justifyContent}
      $isInline={isInline}
      $padding={padding}
      $margin={margin}
      $gap={gap}
      $flex={flex}
      {...rest}
    />
  );
}

Row.displayName = "Row";
