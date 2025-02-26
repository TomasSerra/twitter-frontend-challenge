import { useState, forwardRef } from "react";
import { StyledTweetContainer } from "./TweetContainer";
import AuthorData from "./user-post-data/AuthorData";
import type { Post } from "../../service";
import { StyledReactionsContainer } from "./ReactionsContainer";
import Reaction from "./reaction/Reaction";
import useHttpRequestService from "../../service/useHttpRequestService";
import { IconType } from "../icon/Icon";
import { StyledContainer } from "../common/Container";
import ThreeDots from "../common/ThreeDots";
import DeletePostModal from "./delete-post-modal/DeletePostModal";
import ImageContainer from "./tweet-image/ImageContainer";
import CommentModal from "../comment/comment-modal/CommentModal";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";

interface TweetProps {
  post: Post;
  ref?: any;
}

const Tweet = forwardRef<HTMLDivElement, TweetProps>(({ post }, ref) => {
  const [actualPost, setActualPost] = useState<Post>(post);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const { likePost, unlikePost, retweetPost, deleteRetweetPost, getPostById } =
    useHttpRequestService();
  const navigate = useNavigate();
  const { data: user } = useMe();

  const handleLike = async () => {
    const reacted = hasLiked();
    if (reacted) {
      await unlikePost(actualPost?.id).then(() => {
        getPostById(actualPost?.id).then((res) => setActualPost(res));
      });
    } else {
      await likePost(actualPost?.id).then(() => {
        getPostById(actualPost?.id).then((res) => setActualPost(res));
      });
    }
  };
  const handleRetweet = async () => {
    const reacted = hasRetweeted();
    if (reacted) {
      await deleteRetweetPost(actualPost?.id).then(() => {
        getPostById(actualPost?.id).then((res) => setActualPost(res));
      });
    } else {
      await retweetPost(actualPost?.id).then(() => {
        getPostById(actualPost?.id).then((res) => setActualPost(res));
      });
    }
  };

  const hasLiked = (): boolean => {
    return actualPost?.likes?.find((r) => r.userId === user?.id);
  };

  const hasRetweeted = (): boolean => {
    return actualPost?.retweets?.find((r) => r.userId === user?.id);
  };

  return (
    <StyledTweetContainer ref={ref}>
      <StyledContainer
        style={{ width: "100%" }}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        maxHeight={"48px"}
      >
        <AuthorData
          id={post?.author?.id}
          name={post?.author?.name ?? "Name"}
          username={post?.author?.username}
          createdAt={post?.createdAt}
          profilePicture={post?.author?.profilePicture}
        />
        {post.authorId === user?.id && (
          <>
            <DeletePostModal
              show={showDeleteModal}
              id={post?.id}
              onClose={() => {
                setShowDeleteModal(false);
              }}
            />
            <ThreeDots
              onClick={() => {
                setShowDeleteModal(!showDeleteModal);
              }}
            />
          </>
        )}
      </StyledContainer>
      <StyledContainer onClick={() => navigate(`/post/${post?.id}`)}>
        <p>{post?.content}</p>
      </StyledContainer>
      {post?.images && post?.images!.length > 0 && (
        <StyledContainer padding={"0 0 0 10%"}>
          <ImageContainer images={post?.images} />
        </StyledContainer>
      )}
      <StyledReactionsContainer>
        <Reaction
          img={IconType.CHAT}
          count={actualPost.comments?.length ?? 0}
          reactionFunction={() =>
            window.innerWidth > 600
              ? setShowCommentModal(true)
              : navigate(`/compose/comment/${post?.id}`)
          }
          increment={0}
          reacted={false}
        />
        <Reaction
          img={IconType.RETWEET}
          count={actualPost.retweets?.length ?? 0}
          reactionFunction={() => handleRetweet()}
          increment={1}
          reacted={hasRetweeted()}
        />
        <Reaction
          img={IconType.LIKE}
          count={actualPost.likes?.length ?? 0}
          reactionFunction={() => handleLike()}
          increment={1}
          reacted={hasLiked()}
        />
      </StyledReactionsContainer>
      <CommentModal
        show={showCommentModal}
        post={post}
        onClose={() => setShowCommentModal(false)}
      />
    </StyledTweetContainer>
  );
});

export default Tweet;
