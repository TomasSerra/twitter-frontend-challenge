import React from "react";
import Feed from "./Feed";
import { useGetFeed } from "../../hooks/useGetFeed";

const ContentFeed = () => {
  const { posts, loading, setPage, hasMore } = useGetFeed();

  return (
    <Feed posts={posts} loading={loading} setPage={setPage} hasMore={hasMore} />
  );
};

export default ContentFeed;
