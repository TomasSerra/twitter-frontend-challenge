import { useEffect, useState } from "react";
import { Author } from "../service";
import useHttpRequestService from "../service/useHttpRequestService";

interface UseGetRecommendationsProps {
  query: string;
  skip: number;
}
export const useGetSearchUsers = ({
  query,
  skip,
}: UseGetRecommendationsProps) => {
  const [users, setUsers] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const { searchUsers } = useHttpRequestService();

  useEffect(() => {
    setUsers([]);
  }, [query]);

  useEffect(() => {
    try {
      setLoading(true);
      setError(false);

      searchUsers(query).then((res) => {
        const updatedUsers = [...users, ...res];
        setUsers(
          updatedUsers
            .filter((user, index) => {
              const currentIndex = updatedUsers.findIndex(
                (u) => u.id === user.id
              );
              return currentIndex === index;
            })
            .filter((user) => user.username.includes(query))
        );

        setHasMore(res.length > 0);
        setLoading(false);
      });
    } catch (e) {
      setError(true);
      console.log(e);
    }
  }, [query, skip]);

  return { users, loading, error, hasMore };
};
