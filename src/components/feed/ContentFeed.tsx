import Feed from "./Feed";
import { useGetFeed } from "../../hooks/useGetFeed";

const ContentFeed = ({ activePage }: { activePage: boolean }) => {
  const { posts, loading, setPage, hasMore } = useGetFeed(activePage);

  return (
    <Feed posts={posts} loading={loading} setPage={setPage} hasMore={hasMore} />
  );
};

export default ContentFeed;
