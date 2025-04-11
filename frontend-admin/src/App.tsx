import "./styles/App.css";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LayoutAdmin from "./layouts/layout.admin";
import NotFound from "./page/404";
import Dashboard from "./page/dashboard";
import Company from "./page/company";
import Job from "./page/job";
import User from "./page/user";
import Resume from "./page/resume";
import Role from "./page/role";
import Permission from "./page/permission";
import Login from "./page/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_TIME } from "./common/constants";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import Router from "./routes";
import { ConfigProvider } from "antd";
import { theme } from "./config/theme";
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
          <ConfigProvider theme={theme}>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </ConfigProvider>
        </QueryClientProvider>
      </MotionLazyContainer>
    </>
  );
}

export default App;
