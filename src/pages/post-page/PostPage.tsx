import { useState, useEffect } from "react";
import { StyledContainer } from "../../components/common/Container";
import Tweet from "../../components/tweet/Tweet";
import Loader from "../../components/loader/Loader";
import useHttpService from "../../service/useHttpRequestService";
import TweetBox from "../../components/tweet-box/TweetBox";
import { StyledH5 } from "../../components/common/text";
import { StyledFeedContainer } from "../home-page/components/contentContainer/FeedContainer";
import CommentFeed from "../../components/feed/CommentFeed";

const PostPage = () => {
  const postId = window.location.href.split("/")[4];
  const [post, setPost] = useState(undefined);
  const { getPostById } = useHttpService();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostById(postId);
        setPost(res);
      } catch (e) {
        console.error(e);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <StyledContainer borderRight={"1px solid #ebeef0"}>
      <StyledContainer
        padding={"16px"}
        borderBottom={"1px solid #ebeef0"}
        maxHeight={"53px"}
      >
        <StyledH5>Tweet</StyledH5>
      </StyledContainer>
      <StyledFeedContainer>
        {post ? (
          <>
            <Tweet post={post} />
            <StyledContainer
              borderBottom={"1px solid #ebeef0"}
              padding={"16px"}
            >
              <TweetBox parentId={postId} />
            </StyledContainer>

            <StyledContainer minHeight={"53.5vh"}>
              <CommentFeed postId={postId} />
            </StyledContainer>
          </>
        ) : (
          <StyledContainer justifyContent={"center"} alignItems={"center"}>
            <Loader />
          </StyledContainer>
        )}
      </StyledFeedContainer>
    </StyledContainer>
  );
};

export default PostPage;
