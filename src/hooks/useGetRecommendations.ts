import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";
import { Author } from "../service";

interface UseGetRecommendationsProps {
  page: number;
}

export const useGetRecommendations = ({ page }: UseGetRecommendationsProps) => {
  const [users, setUsers] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { getRecommendedUsers } = useHttpRequestService();

  const getUsers = async () => {
    return await getRecommendedUsers(10, page);
  };

  useEffect(() => {
    if (page !== undefined && hasMore) {
      setLoading(true);
      getUsers()
        .then((response) => {
          const responseUsers = response.users;
          if (responseUsers?.length === 0) {
            setHasMore(false);
          } else {
            setUsers((prev) => {
              const uniqueIds = new Set(prev?.map((user) => user.id));
              const filteredUsers = responseUsers?.filter(
                (user: Author) => !uniqueIds.has(user.id)
              );
              return [...prev, ...filteredUsers];
            });
          }
          setLoading(false);
        })
        .catch((e) => {
          setError(e);
          setLoading(false);
          setHasMore(false);
        });
    }
  }, [page, hasMore]);

  return { users, loading, error, hasMore };
};
