"use client";

import { getBreakpoint } from "@/UI/Global/breakpoints";
import React from "react";
import styled from "styled-components";

interface ColumnBaseProps {
  $alignItems?: "flex-start" | "center" | "flex-end";
  $columns?: number;
  $default?: number;
  $flexBasis?: string;
  $flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  $flexGrow?: string;
  $flexShrink?: string;
  $justifyContent?: "space-between" | "center" | "flex-start" | "flex-end";
  $phone?: number;
  $small?: number;
  $xSmall?: number;
  $tablet?: number;
  $medium?: number;
  $large?: number;
  $xLarge?: number;
  style?: { [key: string]: string | number };
  $padding?: string | number;
}

interface ColumnProps {
  columns?: number;
  alignItems?: ColumnBaseProps["$alignItems"];
  default?: number;
  flexDirection?: ColumnBaseProps["$flexDirection"];
  flexGrow?: ColumnBaseProps["$flexGrow"];
  flexShrink?: ColumnBaseProps["$flexShrink"];
  flexBasis?: ColumnBaseProps["$flexBasis"];
  justifyContent?: ColumnBaseProps["$justifyContent"];
  phone?: number;
  small?: number;
  xSmall?: number;
  tablet?: number;
  medium?: number;
  large?: number;
  xLarge?: number;
  padding?: string | number;
  style?: { [key: string]: string | number };
  className?: string;

  children?: React.ReactNode | Array<React.ReactNode>;
}

export function calculateSize(size?: number, columns?: number) {
  if (!size || !columns) return "";
  return `
    width: ${(size / columns) * 100}%;
    flex-basis: ${(size / columns) * 100}%;
    max-width: ${(size / columns) * 100}%;
  `;
}

const StyledColumn = styled.div<ColumnBaseProps>`
  display: flex;
  width: 100%;
  flex-direction: ${({ $flexDirection }) => $flexDirection || "column"};
  flex-grow: ${({ $flexGrow }) => $flexGrow || 1};
  flex-shrink: ${({ $flexShrink }) => $flexShrink || 0};
  flex-basis: ${({ $flexBasis }) => $flexBasis || "0%"};
  align-items: ${({ $alignItems }) => $alignItems || "flex-start"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "flex-start"};
  padding: ${({ $padding }) => $padding || "0"};

  /* Default size */
  ${(props) => calculateSize(props.$default, props.$columns)}

  /* Phone size */
  ${getBreakpoint({
    min: "xSmall",
  })} {
    ${(props) => calculateSize(props.$xSmall, props.$columns)}
  }
  ${getBreakpoint({
    min: "phone",
  })} {
    ${(props) => calculateSize(props.$phone, props.$columns)}
  }

  /* Small size */
  ${getBreakpoint({
    min: "small",
  })} {
    ${(props) => calculateSize(props.$small, props.$columns)}
  }

  /* Tablet size */
  ${getBreakpoint({
    min: "tablet",
  })} {
    padding: ${({ $padding }) => $padding || "0"};
    ${(props) => calculateSize(props.$tablet, props.$columns)}
  }

  /* Medium size */
  ${getBreakpoint({
    min: "medium",
  })} {
    ${(props) => calculateSize(props.$medium, props.$columns)}
  }

  /* Large size */
  ${getBreakpoint({
    min: "large",
  })} {
    ${(props) => calculateSize(props.$large, props.$columns)}
  }

  /* X Large size */
  ${getBreakpoint({
    min: "xLarge",
  })} {
    ${(props) => calculateSize(props.$xLarge, props.$columns)}
  }
`;

export function Column({
  children,
  columns = 12,
  default: defaultWidth = 12,
  alignItems,
  flexDirection,
  flexGrow,
  flexShrink,
  flexBasis,
  justifyContent,
  phone,
  small,
  xSmall,
  tablet,
  medium,
  large,
  xLarge,
  padding,
  style,
  className,
  ...props
}: ColumnProps): React.JSX.Element {
  return (
    <StyledColumn
      $columns={columns}
      $alignItems={alignItems}
      $flexDirection={flexDirection}
      $default={defaultWidth}
      $flexGrow={flexGrow}
      $flexBasis={flexBasis}
      $flexShrink={flexShrink}
      $justifyContent={justifyContent}
      $phone={phone}
      $small={small}
      $tablet={tablet}
      $medium={medium}
      $large={large}
      $xLarge={xLarge}
      $xSmall={xSmall}
      $padding={padding}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </StyledColumn>
  );
}
Column.displayName = "Column";
