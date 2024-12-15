import {
  Title,
  TitleBackground,
  TitleLink,
} from "@/routes/home/components/title";
import { Row } from "@/UI/Atoms/Row";

export default function Home() {
  return (
    <TitleBackground justifyContent="center" padding="10rem 0 15rem">
      <Title className="App">WELCOME</Title>
      <Row justifyContent="center">
        <TitleLink href="">Home</TitleLink>
        <TitleLink href="">Podcasts</TitleLink>
        <TitleLink href="">Workshops</TitleLink>
      </Row>
    </TitleBackground>
  );
}
