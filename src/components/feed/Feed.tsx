import React, { useRef, useCallback } from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";

interface FeedProps {
  posts: Post[];
  loading: boolean;
  setPage: (page: number | ((prevPage: number) => number)) => void;
  hasMore: boolean;
}

const Feed = ({ posts, loading, setPage, hasMore }: FeedProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage: number) => prevPage + 1);
          }
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <StyledContainer width={"100%"} alignItems={"center"}>
      {posts
        ?.filter(
          (post, index, self) =>
            self.findIndex((p) => p.id === post.id) === index
        )
        .map((post, index) => {
          if (index === posts.length - 1) {
            return <Tweet key={post.id} post={post} ref={lastPostRef} />;
          }
          return <Tweet key={post.id} post={post} />;
        })}

      {loading && <Loader />}
    </StyledContainer>
  );
};

export default Feed;
