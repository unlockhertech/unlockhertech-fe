"use client";
import { Row } from "@/UI/Atoms/Row";
import Link from "next/link";
import { JSX } from "react";
import styled from "styled-components";
import { PregnantPersonWelcomeSVG } from "./icons/PregnantPersonWelcome";
import { PersonWelcomeSVG } from "./icons/PersonWelcome";

export const Title = styled.h3`
  font-family: ${({ theme }) => theme.headerFont};
  color: ${({ theme }) => theme.green};
  text-align: center;
  position: absolute;
  font-size: 7vw;
`;

export const TitleBackground = styled(Row)`
  background: ${({ theme }) => theme.pink};
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
    <>
      <PregnantPersonWelcomeSVG />
      <Title>WELCOME</Title>
      <PersonWelcomeSVG />
    </>
  );
};
