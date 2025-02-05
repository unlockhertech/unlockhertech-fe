import {
  TitleBackground,
  TitleLink,
  TitleWithIcons,
} from "@/routes/home/components/title";
import { Row } from "@/UI/Atoms/Row";

export default function Home() {
  return (
    <TitleBackground justifyContent="center" alignItems="center">
      <TitleWithIcons />
      <Row padding="0 0 15rem" justifyContent="center">
        <TitleLink href="">Home</TitleLink>
        <TitleLink href="">Podcasts</TitleLink>
        <TitleLink href="">Workshops</TitleLink>
      </Row>
    </TitleBackground>
  );
}
