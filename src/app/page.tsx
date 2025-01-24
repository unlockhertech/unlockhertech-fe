import {
  TitleBackground,
  TitleLink,
  TitleWithIcons,
} from "@/routes/home/components/title";
import { Row } from "@/UI/Atoms/Row";

export default function Home() {
  return (
    <TitleBackground justifyContent="center">
      <Row alignItems="center" justifyContent="center">
        <TitleWithIcons />
      </Row>
      <Row justifyContent="center">
        <TitleLink href="">Home</TitleLink>
        <TitleLink href="">Podcasts</TitleLink>
        <TitleLink href="">Workshops</TitleLink>
      </Row>
    </TitleBackground>
  );
}
