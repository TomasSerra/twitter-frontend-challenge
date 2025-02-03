import { useApiQuery } from "./useReactQuery";
import useHttpRequestService from "../service/useHttpRequestService";

export function useMe() {
  const { me } = useHttpRequestService();

  return useApiQuery(["me"], me);
}
