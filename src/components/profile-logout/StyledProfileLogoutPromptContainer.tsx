import styled from "styled-components";

interface Props {
  margin: string;
}

interface ContainerProps {
  direction: string;
}

export const StyledProfileLogoutPromptContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
`;
export const StyledLogoutPrompt = styled.div<Props>`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  margin: ${(props) => props.margin};
`;
