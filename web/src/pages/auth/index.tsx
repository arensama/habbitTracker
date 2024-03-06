import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  notification,
} from "antd";
import Title from "antd/es/typography/Title";
import useUser from "../../hooks/useUser";
import { useAuth } from "../../api/auth/authHook";
import style from "./index.module.css";

const Auth = () => {
  const [notif, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const { login: loginApi } = useAuth();
  const { login } = useUser();
  const onFinish = async (values: any) => {
    loginApi
      .mutateAsync(values)
      .then((res: any) => {
        // console.log("res", res?.data);
        notif["success"]({
          message: "successful authentication",
        });
        login(res?.data);
      })
      .catch((err) => {
        notif["error"]({
          message: "invalid user Credential",
          description: err?.response?.data?.message ?? "Connection Error",
        });
        console.log(err?.response?.data ?? "Connection Error");
      });
  };
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Card
        style={{
          position: "absolute",
          top: "20%",
          right: "calc(50% - 250px)",
          width: "500px",
          background: "transparent",
        }}
      >
        <Form onFinish={onFinish} form={form}>
          <Row justify={"space-around"} gutter={[16, 16]}>
            <Col style={{ marginBottom: 50 }}>
              <h1 className={style.title}>
                <div className={style.titleBG}></div>Amirreza & Aminreza Habbit
                Tracker
              </h1>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"username"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  placeholder="username"
                  className={style.input}
                  size="large"
                />
              </Form.Item>
            </Col>{" "}
            <Col span={24}>
              <Form.Item
                name={"password"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  placeholder="password"
                  type="password"
                  className={style.input}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col>
              <button className="pbtn" type="submit">
                <Row gutter={[4, 4]} align={"middle"}>
                  <Col>
                    <Typography>login</Typography>
                  </Col>
                </Row>
              </button>
            </Col>
            {/* <Col>
              <button className="pbtn">
                <Row gutter={[4, 4]} align={"middle"}>
                  <Col>
                    <Typography>signup</Typography>
                  </Col>
                </Row>
              </button>
            </Col> */}
          </Row>
        </Form>
      </Card>

      <Row>
        <Col></Col>
      </Row>
      {contextHolder}
    </div>
  );
};
export default Auth;
