import { StyledContainer } from "../common/Container";
import StyledChatContainer from "./StyledChatContainer";

interface ChatProps {
  content: string;
  isMe: boolean;
  createdAt?: string;
}

const Chat = ({ content = "", isMe = false, createdAt }: ChatProps) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const minutes =
      dateObj.getMinutes() < 10
        ? `0${dateObj.getMinutes()}`
        : dateObj.getMinutes();
    return `${dateObj.getHours()}:${minutes}`;
  };
  const formattedDate = createdAt ? formatDate(createdAt) : "";

  return (
    <StyledChatContainer isMe={isMe}>
      <StyledContainer display="flex" flexDirection="column" gap={"8px"}>
        {content}
        <StyledContainer
          opacity={0.6}
          width="100%"
          textAlign="right"
          fontSize="12px"
        >
          {formattedDate}
        </StyledContainer>
      </StyledContainer>
    </StyledChatContainer>
  );
};

export default Chat;
