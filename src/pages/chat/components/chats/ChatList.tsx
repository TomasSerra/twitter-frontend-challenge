import { useEffect, useRef, useState } from "react";
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chats]);

  return (
    <>
      {chats.map((chat, index) => {
        const isNotMe = chat.senderId === toUserData.id;
        console.log(isNotMe);
        const direction = isNotMe ? "flex-start" : "flex-end";
        return (
          <StyledContainer
            key={index}
            display="flex"
            flexDirection="row"
            justifyContent={direction}
            width="100%"
            padding="5px 20px"
          >
            <Chat
              content={chat.content}
              isMe={!isNotMe}
              createdAt={chat.createdAt}
            />
          </StyledContainer>
        );
      })}
      <div ref={chatEndRef} />
    </>
  );
};

export default ChatList;
