import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface UseGetCommentsProps {
  postId: string;
}

export const useGetComments = ({ postId }: UseGetCommentsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const posts = useAppSelector((state) => state.user.feed);

  const dispatch = useAppDispatch();

  const { getCommentsByPostId } = useHttpRequestService();

  useEffect(() => {
    try {
      setLoading(true);
      setError(false);
      getCommentsByPostId(postId).then((res) => {
        if (!Array.isArray(res)) {
          res = [];
        }
        const updatedPosts = Array.from(new Set([...posts, ...res])).filter(
          (post) => post.parentId === postId
        );
        dispatch(updateFeed(updatedPosts));
        dispatch(setLength(updatedPosts.length));
        setLoading(false);
      });
    } catch (e) {
      setError(true);
      console.log(e);
    }
  }, [postId]);

  return { posts, loading, error };
};
