import { useEffect, useState } from "react";
import Chat from "../../../../components/chats/Chat";
import { User } from "../../../../service";
import useHttpRequestService from "../../../../service/useHttpRequestService";
import { StyledContainer } from "../../../../components/common/Container";

type ChatType = {
  senderId: string;
  content: string;
};

interface ChatListProps {
  toUserData: User;
  meData: User;
}

const ChatList = ({ toUserData, meData }: ChatListProps) => {
  const [chats, setChats] = useState<ChatType[]>([]);
  const { getChats } = useHttpRequestService();

  useEffect(() => {
    setChats([
      {
        senderId: "1",
        content: "Hola Tomas, como estas?",
      },
      {
        senderId: "4dc9d119-c9bc-44be-9738-aef1cded728b",
        content: "Hola pepe, todo bien vos?",
      },
    ]);
  }, [toUserData]);

  return (
    <>
      {chats.map((chat, index) => {
        const isMe = chat.senderId === meData.id;
        const direction = isMe ? "flex-end" : "flex-start";
        return (
          <StyledContainer
            key={index}
            display="flex"
            flexDirection="row"
            justifyContent={direction}
            width="100%"
            padding="15px"
          >
            <Chat key={index} content={chat.content} isMe={isMe} />
          </StyledContainer>
        );
      })}
    </>
  );
};

export default ChatList;
