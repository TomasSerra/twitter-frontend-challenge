import { useEffect, useRef, useState } from "react";
import Chat from "../../../../components/chats/Chat";
import { User } from "../../../../service";
import { StyledContainer } from "../../../../components/common/Container";
import { ChatSocket } from "../../../../hooks/useChat";

export type ChatType = {
  senderId: string;
  content: string;
  createdAt: string;
};

interface ChatListProps {
  toUserData: User;
  meData: User;
  socket: ChatSocket;
}

const ChatList = ({ toUserData, meData, socket }: ChatListProps) => {
  const [chats, setChats] = useState<ChatType[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.joinRoom(toUserData.id);

    const handleMessage = ({
      msg,
      createdAt,
      senderId,
    }: {
      msg: string;
      createdAt: string;
      senderId: string;
    }) => {
      setChats((prevChats) => [
        ...prevChats,
        { senderId, content: msg, createdAt },
      ]);
    };

    socket.onMessage(handleMessage);

    socket.getAllMessages(toUserData.id).then((chats) => {
      setChats((prevChats) => [...prevChats, ...chats]);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chats]);

  return (
    <>
      {chats.map((chat, index) => {
        const isNotMe = chat.senderId === toUserData.id;
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
