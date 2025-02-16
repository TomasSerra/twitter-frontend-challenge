import { useState } from "react";
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
}

const Tweet = ({ post }: TweetProps) => {
  const [actualPost, setActualPost] = useState<Post>(post);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const { deleteReaction, createReaction, getPostById } =
    useHttpRequestService();
  const navigate = useNavigate();
  const { data: user } = useMe();

  const handleReaction = async (type: string) => {
    const reacted = actualPost?.reactions?.find(
      (r) => r.action === type && r.authorId === user?.id
    );
    if (reacted) {
      await deleteReaction(actualPost?.id, type).then(() => {
        getPostById(actualPost?.id).then((res) => setActualPost(res));
      });
    } else {
      await createReaction(actualPost?.id, type).then(() => {
        getPostById(actualPost?.id).then((res) => setActualPost(res));
      });
    }
  };

  const hasReactedByType = (type: string): boolean => {
    return actualPost?.reactions?.some((r) => {
      return r.action === type && r.authorId === user?.id;
    });
  };

  return (
    <StyledTweetContainer>
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
          count={actualPost.qtyComments}
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
          count={actualPost.qtyRetweets}
          reactionFunction={() => handleReaction("RETWEET")}
          increment={1}
          reacted={hasReactedByType("RETWEET")}
        />
        <Reaction
          img={IconType.LIKE}
          count={actualPost.qtyLikes}
          reactionFunction={() => handleReaction("LIKE")}
          increment={1}
          reacted={hasReactedByType("LIKE")}
        />
      </StyledReactionsContainer>
      <CommentModal
        show={showCommentModal}
        post={post}
        onClose={() => setShowCommentModal(false)}
      />
    </StyledTweetContainer>
  );
};

export default Tweet;
