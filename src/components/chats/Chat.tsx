import StyledChatContainer from "./StyledChatContainer";

interface ChatProps {
  content: string;
  isMe: boolean;
}

const Chat = ({ content = "", isMe = false }: ChatProps) => {
  return <StyledChatContainer isMe={isMe}>{content}</StyledChatContainer>;
};

export default Chat;
