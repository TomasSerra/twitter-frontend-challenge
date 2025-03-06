import { useParams } from "react-router-dom";
import { StyledContainer } from "../../components/common/Container";
import Header from "./components/header/Header";
import { useEffect, useState } from "react";
import useHttpRequestService from "../../service/useHttpRequestService";
import { useMe } from "../../hooks/useMe";
import { User } from "../../service";
import ChatInput from "../../components/chat-input/ChatInput";
import ChatList from "./components/chats/ChatList";
import useChat from "../../hooks/useChat";
import { StyledChatPageContainer } from "./StyledChatPageContainer";

const ChatPage = () => {
  const toUserId = useParams().id || "";
  const { getProfileView } = useHttpRequestService();
  const { data: me } = useMe();
  const [toUserData, setToUserData] = useState<User>();
  const chatSocket = useChat();

  useEffect(() => {
    chatSocket.connect();
    chatSocket.joinRoom(toUserId);

    return () => {
      chatSocket.leaveRoom(toUserId);
      chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    getProfileView(toUserId).then((res) => {
      setToUserData(res);
    });
  }, [toUserId]);

  return (
    <StyledChatPageContainer>
      <Header toUserData={toUserData} />
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
    </StyledChatPageContainer>
  );
};

export default ChatPage;
