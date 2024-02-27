import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: #81a6e6;
  color: #fff;
  padding: 20px 0;
  margin-top: 20%;
  justify-content: flex end;
`;

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
    <footer >
      <Container>
        <Row>
          <Col>
            <p>Social medias</p>
          </Col>
        </Row>
      </Container>
    </footer>
    </StyledFooter>
  );
};
