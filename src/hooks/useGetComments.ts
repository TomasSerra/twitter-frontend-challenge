import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { LIMIT } from "../util/Constants";

interface UseGetCommentsProps {
  postId: string;
}

export const useGetComments = ({ postId }: UseGetCommentsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  let comments = useAppSelector((state) => state.user.feed) || [];
  const dispatch = useAppDispatch();
  const { getCommentsByPostId } = useHttpRequestService();

  useEffect(() => {
    setPage(0);
    dispatch(updateFeed([]));
    dispatch(setLength(0));
    comments = [];
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    fetchData(page);
  }, [page, postId]);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      setError(false);
      const query = `?skip=${page * LIMIT}&limit=${LIMIT}`;
      const res = await getCommentsByPostId(postId, query);
      const safeRes = Array.isArray(res) ? res : [];

      dispatch(updateFeed([...comments, ...safeRes]));
      dispatch(setLength(comments.length + safeRes.length));

      setHasMore(safeRes.length === LIMIT);
      setLoading(false);
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  return { comments, loading, error, setPage, hasMore };
};
