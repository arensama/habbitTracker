import { Card, Col, Row } from "antd";
import { PropsWithChildren } from "react";
interface IStatCard extends PropsWithChildren {
  data?: any;
  title: string;
  icon: string;
  bgColor: string;
}
export default function StatCard({
  data,
  title,
  icon,
  bgColor,
  children,
}: IStatCard) {
  return (
    <Card
      bordered={false}
      style={{ background: bgColor, width: "100%", height: 234 }}
    >
      <Row>
        <Col span={24}>
          <img src={icon} />
        </Col>
        <Col span={24}>
          <h1>{title}</h1>
        </Col>
        {data != undefined && (
          <Col span={24}>
            <h2 style={{ marginTop: 9 }}>{`${data} DAYS`}</h2>
          </Col>
        )}
        {children && (
          <Col span={24}>
            <p>{children}</p>
          </Col>
        )}
      </Row>
    </Card>
  );
}
