import { useParams } from "react-router-dom";
import { StyledContainer } from "../../components/common/Container";
import Header from "./components/header/Header";
import { useEffect, useState } from "react";
import useHttpRequestService from "../../service/useHttpRequestService";
import { useMe } from "../../hooks/useMe";
import { User } from "../../service";
import ChatInput from "../../components/chat-input/ChatInput";
import ChatList from "./components/chats/ChatList";

const ChatPage = () => {
  const toUserId = useParams().id || "";
  const { getProfileView } = useHttpRequestService();
  const { data: me } = useMe();
  const [toUserData, setToUserData] = useState<User>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

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
      <StyledContainer height="100%" width="100%">
        {toUserData && me && <ChatList toUserData={toUserData} meData={me} />}
      </StyledContainer>
      <StyledContainer height={"fit-content"} width={"100%"}>
        <ChatInput />
      </StyledContainer>
    </StyledContainer>
  );
};

export default ChatPage;
