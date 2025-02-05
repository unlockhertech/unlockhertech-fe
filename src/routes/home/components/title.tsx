"use client";
import { Row } from "@/UI/Atoms/Row";
import Link from "next/link";
import { JSX } from "react";
import styled from "styled-components";
import { PregnantPersonWelcomeSVG } from "./icons/PregnantPersonWelcome";
import { PersonWelcomeSVG } from "./icons/PersonWelcome";
import { Column } from "@/UI/Atoms/Column";
import { getBreakpoint } from "@/UI/Global/breakpoints";
import { theme } from "@/UI/Global/theme";

export const Title = styled.h3`
  font-family: ${({ theme }) => theme.headerFont};
  color: ${({ theme }) => theme.green};
  text-align: center;
  font-size: 5rem;
  z-index: 100;
  ${getBreakpoint({
    min: "phone",
  })} {
    font-size: 10rem;
  }
`;

export const TitleBackground = styled(Row)<{ $colour?: keyof typeof theme }>`
  background: ${({ theme, $colour }) => ($colour ? theme[$colour] : "white")};
`;

export const TitleLink = styled(Link)`
  color: ${({ theme }) => theme.green};
  text-decoration: none;
  margin: 0 2rem 0 0;
  &:last-of-type {
    margin: 0;
  }
`;

export const TitleWithIcons = (): JSX.Element => {
  return (
    <Row padding="5rem 0 0" justifyContent="center" alignItems="center">
      <Column alignItems="flex-end" xSmall={5} tablet={3.5}>
        <PregnantPersonWelcomeSVG />
      </Column>
      <Column alignItems="center" xSmall={2} tablet={5}>
        <Title>WELCOME</Title>
      </Column>
      <Column alignItems="flex-start" xSmall={5} tablet={3.5}>
        <PersonWelcomeSVG />
      </Column>
    </Row>
  );
};
