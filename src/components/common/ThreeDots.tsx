import React from "react";
import { StyledContainer } from "./Container";
import { StyledDot } from "./Dot";

const ThreeDots = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledContainer
      flexDirection={"row"}
      gap={"2px"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"30px"}
      height={"30px"}
      padding={"2px"}
      borderRadius={"50%"}
      hoverable
      marginRight={window.innerWidth < 700 ? 10 : 0}
      onClick={onClick}
      cursor={"pointer"}
    >
      <StyledDot />
      <StyledDot />
      <StyledDot />
    </StyledContainer>
  );
};

export default ThreeDots;
