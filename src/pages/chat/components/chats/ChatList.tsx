import { useEffect, useState } from "react";
import Chat from "../../../../components/chats/Chat";
import { User } from "../../../../service";
import { StyledContainer } from "../../../../components/common/Container";
import { Socket } from "socket.io-client";

type ChatType = {
  senderId: string;
  content: string;
  createdAt: string;
};

interface ChatListProps {
  toUserData: User;
  meData: User;
  socket: Socket;
}

const ChatList = ({ toUserData, meData, socket }: ChatListProps) => {
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    socket.connect();
    socket.emit("join room", { receiverId: toUserData.id });
    socket.emit("bring room", { receiverId: toUserData.id });
    socket.on(
      "chat message",
      (msg: string, createdAt: string, senderId: string) => {
        setChats((prevChats) => [
          ...prevChats,
          { senderId, content: msg, createdAt },
        ]);
      }
    );

    return () => {
      socket.off("chat message");
    };
  }, []);

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
