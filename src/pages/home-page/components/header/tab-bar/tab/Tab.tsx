import type { MouseEventHandler } from "react";
import React from "react";
import { StyledTabContainer } from "./TabContainer";
import { StyledBlueRow } from "./BlueRow";

const Tab = ({ text, active, onClick }: TabProps) => {
  return (
    <StyledTabContainer onClick={onClick} style={{ cursor: "pointer" }}>
      <p className={active ? "active" : ""}>{text}</p>
      {active && <StyledBlueRow />}
    </StyledTabContainer>
  );
};

interface TabProps {
  text: string;
  active: boolean;
  onClick: MouseEventHandler;
}
export default Tab;
