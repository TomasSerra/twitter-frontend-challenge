import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { LIMIT } from "../util/Constants";

export const useGetFeed = (activePage: boolean) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  let posts = useAppSelector((state) => state.user.feed) || [];
  const query = useAppSelector((state) => state.user.query);

  const dispatch = useAppDispatch();
  const { getPosts, getFollowedPosts } = useHttpRequestService();

  useEffect(() => {
    setPage(0);
    dispatch(updateFeed([]));
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    fetchData(page);
  }, [page, query]);

  useEffect(() => {
    dispatch(setLength(0));
    dispatch(updateFeed([]));
    posts = [];
    setPage(0);
    fetchData(0);
    setHasMore(true);
  }, [activePage]);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      setError(false);
      const query = `?skip=${page * LIMIT}&limit=${LIMIT}`;
      const res = activePage
        ? await getPosts(query)
        : await getFollowedPosts(query);
      const safeRes = Array.isArray(res) ? res : [];

      dispatch(updateFeed([...posts, ...safeRes]));
      dispatch(setLength(posts.length + safeRes.length));

      setHasMore(safeRes.length === LIMIT);
      setLoading(false);
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  return { posts, loading, error, setPage, hasMore };
};
