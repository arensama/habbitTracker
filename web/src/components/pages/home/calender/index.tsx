import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Col, Progress, Row, Tag } from "antd";
import dayjs from "dayjs";
import { weekDays } from "../../../../assets/weekDays";
import { ITracker } from "../../../../api/tracker/trackerHook";
const getListData = (value: Dayjs, history: ITracker[], schedule: number[]) => {
  let listData = [];

  for (let i = 0; i < history.length; i++) {
    const tryi = history[i];
    if (
      value.date() == dayjs(tryi.start).date() &&
      value.month() == dayjs(tryi.start).month() &&
      value.year() == dayjs(tryi.start).year()
    )
      listData.push(tryi);
  }
  return { listData };
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

export default function HomeCalender({
  history,
  schedule,
}: {
  history: ITracker[];
  schedule: number[];
}) {
  // console.log("history", history);
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const { listData } = getListData(value, history, schedule);
    return (
      <Row
        gutter={[8, 8]}
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
        }}
      >
        {listData.map((item) => (
          <Col
            span={24}
            key={JSON.stringify(item._id)}
            style={{
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Progress
              percent={item.percent}
              type="circle"
              strokeWidth={20}
              size={20}
              // format={(number) => `${number}`}
            />
            <p
              style={{
                maxWidth: 100,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {`%${item.percent} ${item.taskTitle}`}
            </p>
          </Col>
        ))}
      </Row>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
}
