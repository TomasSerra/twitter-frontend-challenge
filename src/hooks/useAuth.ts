import { useEffect, useState } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const service = useHttpRequestService();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await service.isLogged();
        setIsAuthenticated(loggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};
