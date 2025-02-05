"use client";
import { Row } from "@/UI/Atoms/Row";

const H3 = styled.h3`
  font-size: 4rem;
  font-family: ${({ theme }) => theme.headerFont};
  color: black;
  z-index: 100;
  margin: 0;
`;

const P = styled.p`
  height: auto;
  overflow: visible;
  font-weight: 700;
  font-style: normal;
  color: ${({ theme }) => theme.purple};
  font-size: 2rem;
  line-height: 1.5;
  margin: 0;
  text-align: left;
`;

import { TitleBackground } from "../components/title";
import { Column } from "@/UI/Atoms/Column";
import styled from "styled-components";
import { PersonStanding } from "../components/icons/PersonStanding";

export function SecondRow(): React.JSX.Element {
  return (
    <TitleBackground justifyContent="center" alignItems="center">
      <Row alignItems="center" justifyContent="center">
        <PersonStanding />
      </Row>
      <Row padding="0 5rem" alignItems="flex-start" justifyContent="center">
        <Column padding={"1rem 1rem 0"} xSmall={12} large={6}>
          <H3>Surfing the Technological Wave</H3>
        </Column>
        <Column padding="1rem 1rem 0" xSmall={12} large={6}>
          <P>
            Welcome to ‘Unlock Her Tech’, your utopian 90s digital space filled
            with atomic purple flavour and Ventura highway feeling for all the
            tech queens. With hosts that are not just wildly fierce, meet Fatma,
            Ellie, and Pritanya, the xyz powerpuff girls of technology with
            their resounding wisdom packaged as podcasts and workshops.
          </P>
        </Column>
      </Row>
    </TitleBackground>
  );
}
