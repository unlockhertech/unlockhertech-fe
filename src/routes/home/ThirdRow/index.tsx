"use client";
import { Row } from "@/UI/Atoms/Row";

const P = styled.p`
  height: auto;
  overflow: visible;
  font-style: normal;
  color: black;
  font-size: 1.3rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

import { TitleBackground } from "../components/title";
import styled from "styled-components";
import { PersonWheelchair } from "../components/icons/PersonWheelchair";

export function ThirdRow(): React.JSX.Element {
  return (
    <TitleBackground $colour="pink" justifyContent="center" alignItems="center">
      <Row padding="0 0 3rem" alignItems="center" justifyContent="center">
        <PersonWheelchair></PersonWheelchair>
      </Row>
      <Row alignItems="center" justifyContent="center">
        <a
          style={{
            padding: "1rem",
          }}
          target="_blank"
          href="https://www.instagram.com/unlockhertech/"
        >
          <img width="30" src="instagram.png" alt="Instagram icon"></img>
        </a>
        <a
          style={{
            padding: "1rem",
          }}
          target="_blank"
          href="https://www.linkedin.com/company/unlockhertech"
        >
          <img width="33" src="linkedin.png" alt="Linkedin icon"></img>
        </a>
      </Row>
      <Row justifyContent="center" padding="0 0 5rem">
        <P>© 2024 Unlock Her Tech - All rights reserved</P>
      </Row>
    </TitleBackground>
  );
}
