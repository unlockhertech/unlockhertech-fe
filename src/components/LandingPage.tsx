import { Carousel } from "react-bootstrap";

export const LandingPage = (): JSX.Element => {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img
          className="image"
          src="https://www.deliveryhero.com/wp-content/uploads/2021/04/DH_Blog_Header_WomenInTech_2000x1100px_2_Blue-1200x660.png"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Women In Tech</h3>
          <p>Empowering women in tech</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img
          className="image"
          src="https://media.wired.com/photos/613bb0daa755c6a4b550bac8/master/pass/Gear-Podcast-Hearing-Loss-1279654034.jpg"
          alt="Podcast Series"
        />
        <Carousel.Caption>
          <h3>Podcast Series</h3>
          <p>Podcast series as self guide</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="image"
          src="https://myindianthings.com/cdn/shop/products/2_6029fe1e-67dc-4814-9a1b-86cef86d188e_800x.jpg?v=1675159452"
          alt="Education"
        />
        <Carousel.Caption>
          <h3>Education</h3>
          <p>Self guide content</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};
