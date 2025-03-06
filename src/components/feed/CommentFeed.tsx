import Feed from "./Feed";
import { useGetComments } from "../../hooks/useGetComments";

interface CommentFeedProps {
  postId: string;
}
const CommentFeed = ({ postId }: CommentFeedProps) => {
  const { comments, setPage, loading, hasMore } = useGetComments({
    postId,
  });

  return (
    <>
      <Feed
        posts={comments}
        loading={loading}
        hasMore={hasMore}
        setPage={setPage}
      />
    </>
  );
};
export default CommentFeed;
