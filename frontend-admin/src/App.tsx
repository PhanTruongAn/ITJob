import "./styles/App.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_TIME } from "./common/constants";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import Router from "./routes";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        gcTime: CACHE_TIME,
      },
    },
  });
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
