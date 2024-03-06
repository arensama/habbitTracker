import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Router from "./router";
import { UserProvider } from "./providers/userProvider";
import { ConfigProvider, theme } from "antd";
import themeConfig from "./theme/themeConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { ApiProvider } from "./providers/apiProvider";
import { GlobalDataProvider } from "./providers/globalProvider";
const queryClient = new QueryClient();
export const baseURL = "http://localhost:4000";

export default function App() {
  axios.defaults.baseURL = baseURL;
  return (
    <ConfigProvider theme={{ ...themeConfig }}>
      <QueryClientProvider client={queryClient}>
        <GlobalDataProvider>
          <ApiProvider>
            <UserProvider>
              <Router />
            </UserProvider>
          </ApiProvider>
        </GlobalDataProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
