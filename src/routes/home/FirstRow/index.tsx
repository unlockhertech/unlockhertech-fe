"use client";
import { Row } from "@/UI/Atoms/Row";
import {
  TitleBackground,
  TitleLink,
  TitleWithIcons,
} from "../components/title";

export function FirstRow(): React.JSX.Element {
  return (
    <TitleBackground $colour="pink" justifyContent="center" alignItems="center">
      <TitleWithIcons />
      <Row padding="0 0 15rem" justifyContent="center">
        <TitleLink href="">Home</TitleLink>
        <TitleLink href="">Podcasts</TitleLink>
        <TitleLink href="">Workshops</TitleLink>
      </Row>
    </TitleBackground>
  );
}
