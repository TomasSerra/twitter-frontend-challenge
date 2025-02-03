import "./App.css";
import { Layout } from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/toast/ToastContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider config={{ duration: 5000, position: "bottom-right" }}>
        <Layout />
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
