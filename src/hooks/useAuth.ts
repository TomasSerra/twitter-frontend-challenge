import { useEffect, useState } from "react";
import useHttpRequestService from "../service/useHttpRequestService";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { isLogged } = useHttpRequestService();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await isLogged();
        setIsAuthenticated(loggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};
