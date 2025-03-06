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
  border-radius: 15px;
  background-color: ${backgroundColor};
  color: black;
  max-width: 70%;
  min-width: 70px;
  word-wrap: break-word;
  position: relative;
  border-bottom-left-radius: ${(props) => (props.isMe ? "15px" : "0")};
  border-bottom-right-radius: ${(props) => (props.isMe ? "0" : "15px")};
`;

export default StyledChatContainer;
