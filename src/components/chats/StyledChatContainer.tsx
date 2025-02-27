import styled from "styled-components";

interface ChatContainerProps {
  isMe: boolean;
}

const backgroundColor = (props: ChatContainerProps & { theme: any }) => {
  const { theme, isMe } = props;
  return isMe ? theme.colors.light : "#f0f3f4";
};

const StyledChatContainer = styled.div<ChatContainerProps>`
  width: fit-content;
  height: fit-content;
  padding: 10px;
  border-radius: 10px;
  background-color: ${backgroundColor};
  color: black;
`;

export default StyledChatContainer;
