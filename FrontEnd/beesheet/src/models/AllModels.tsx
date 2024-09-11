import styled from "styled-components";

export interface Designation{
attributes: string[];
empList: string[],
id: number,
title: string
}

export const StyledText = styled.p`
  font-family: "Monsterrat", sans-serif;
`;