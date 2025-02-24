import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useGetFeed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const posts = useAppSelector((state) => state.user.feed) || [];
  const query = useAppSelector((state) => state.user.query);

  const dispatch = useAppDispatch();
  const { getPosts } = useHttpRequestService();

  useEffect(() => {
    setPage(1);
    dispatch(updateFeed([]));
  }, [query]);

  useEffect(() => {
    if (!hasMore) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const query = `?skip=${page * 6}&limit=6`;
        const res = await getPosts(query);
        const safeRes = Array.isArray(res) ? res : [];

        dispatch(updateFeed([...posts, ...safeRes]));
        dispatch(setLength(posts.length + safeRes.length));

        setHasMore(safeRes.length > 0);
        setLoading(false);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    };

    fetchData();
  }, [page, query]);

  return { posts, loading, error, setPage, hasMore };
};
