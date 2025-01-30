import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useGetFeed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const posts = useAppSelector((state) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);

  const dispatch = useAppDispatch();

  const { getPosts } = useHttpRequestService();

  useEffect(() => {
    try {
      setLoading(true);
      setError(false);
      getPosts(query).then((res) => {
        const safeRes = Array.isArray(res) ? res : [];
        const updatedPosts = Array.from(new Set([...posts, ...safeRes]));
        dispatch(updateFeed(updatedPosts));
        dispatch(setLength(updatedPosts.length));
        setLoading(false);
      });
    } catch (e) {
      setError(true);
      console.log(e);
    }
  }, [query]);

  return { posts, loading, error };
};
