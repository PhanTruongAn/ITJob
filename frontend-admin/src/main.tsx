import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ConfigProvider, App as AntdApp } from "antd";
import { theme } from "./config/theme.ts";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
