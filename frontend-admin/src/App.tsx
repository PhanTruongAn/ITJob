import "./styles/App.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_TIME, STALE_TIME } from "./common/constants";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import Router from "./routes";
import { useEffect } from "react";
import { message } from "antd";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        gcTime: CACHE_TIME,
        staleTime: STALE_TIME,
      },
    },
  });
  useEffect(() => {
    message.config({
      top: 50,
      duration: 2,
      maxCount: 3,
    });
  }, []);
  return (
    <>
      <MotionLazyContainer>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </MotionLazyContainer>
    </>
  );
}

export default App;
