import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "antd";
import {
  HomeOutlined,
  FormOutlined,
  UserOutlined,
  MenuOutlined,
  ProfileOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import MyLayout from "./components/layout";
import HomePage from "./pages/home";
import TaskPage from "./pages/task";

export const routes = [
  {
    label: "home",
    // label: "Dashboard",
    path: "/",
    element: <HomePage />,
    icon: <HomeOutlined />,
  },
  {
    label: "task",
    // label: "Dashboard",
    path: "/task/:id",
    element: <TaskPage />,
    icon: <HomeOutlined />,
  },
];

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MyLayout />}>
          {routes.map((route, index) => (
            <Route
              key={route.label}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
