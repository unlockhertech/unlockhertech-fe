"use client";
import styled from "styled-components";

export const Title = styled.h3`
  font-family: ${({ theme }) => theme.headerFont};
  color: ${({ theme }) => theme.blue};
`;
