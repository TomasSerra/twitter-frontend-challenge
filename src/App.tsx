import "./App.css";
import { Layout } from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";

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
  const language = localStorage.getItem("language");
  if (language) {
    i18n.changeLanguage(language);
  } else {
    localStorage.setItem("language", "en");
    i18n.changeLanguage("en");
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
};

export default App;
