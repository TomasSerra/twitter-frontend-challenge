import { useParams } from "react-router-dom";
import { StyledContainer } from "../../components/common/Container";
import Header from "./components/header/Header";
import { useEffect, useState } from "react";
import useHttpRequestService from "../../service/useHttpRequestService";
import { useMe } from "../../hooks/useMe";
import { User } from "../../service";
import ChatInput from "../../components/chat-input/ChatInput";
import ChatList from "./components/chats/ChatList";
import socket from "../../service/socketService";

const ChatPage = () => {
  const toUserId = useParams().id || "";
  const { getProfileView } = useHttpRequestService();
  const { data: me } = useMe();
  const [toUserData, setToUserData] = useState<User>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const token: string = localStorage.getItem("token")?.split(" ")[1] || "";
  const chatSocket = socket({ token });

  useEffect(() => {
    chatSocket.connect();
    chatSocket.emit("join room", { receiverId: toUserId });

    return () => {
      chatSocket.emit("leave room", { receiverId: toUserId });
      chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    getProfileView(toUserId).then((res) => {
      setToUserData(res.user);
      setIsFollowing(res.isFollowing);
    });
  }, [toUserId]);

  return (
    <StyledContainer
      height="100vh"
      borderRight="1px solid #ebeef0"
      maxWidth="700px"
      overflowY="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Header toUserData={toUserData} isFollowing={isFollowing} />
      <StyledContainer
        height="100%"
        width="100%"
        overflowY="auto"
        padding={"10px 0"}
      >
        {toUserData && me && (
          <ChatList toUserData={toUserData} meData={me} socket={chatSocket} />
        )}
      </StyledContainer>
      <StyledContainer height={"fit-content"} width={"100%"}>
        <ChatInput toUserId={toUserId} socket={chatSocket} />
      </StyledContainer>
    </StyledContainer>
  );
};

export default ChatPage;
