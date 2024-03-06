import { Outlet } from "react-router-dom";
import { Col, Image, Layout, Row, Typography, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";

import { useState } from "react";
import Auth from "../../pages/auth";
import useUser from "../../hooks/useUser";
import style from "./index.module.css";
import avatar from "../../../src/assets/img/general/avatar.png";
import Tracker from "../pages/task/tracker";
const { useToken } = theme;
const { Title } = Typography;
const MyLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { user } = useUser();
  return user.isAuthenticated ? (
    <Layout className={style.layout}>
      <Header className={style.header}>
        <Row justify={"space-between"} align={"middle"}>
          <Col>
            <img className={style.avatar} src={avatar} alt="avatar" />
          </Col>
          <Col>
            <h1 className={style.title}>
              <div className={style.titleBG}></div>Amirreza & Aminreza Habbit
              Tracker
            </h1>
          </Col>
          <Col>blank</Col>
        </Row>
      </Header>
      <Content style={{ padding: 0, background: "transparent" }}>
        <Tracker />
        <Outlet />
      </Content>
    </Layout>
  ) : (
    <Layout className={style.layout}>
      <Content>
        <Auth />
      </Content>
    </Layout>
  );
};

export default MyLayout;
