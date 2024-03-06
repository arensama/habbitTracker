import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Typography,
  notification,
} from "antd";
import style from "./index.module.css";
import plusicon from "../../../src/assets/img/home/plus.svg";
import NewHabitModal from "../../components/pages/home/newmodal";
import { useEffect, useState } from "react";
import { taskIcons } from "../../assets/taskIcons";
import { colors } from "../../assets/colors";
import { Link } from "react-router-dom";
import StatCard from "../../components/pages/task/statCard";
import smileIcon from "../../assets/img/task/smile.svg";
import recordIcon from "../../assets/img/task/recordIcon.svg";
import streakIcon from "../../assets/img/task/streakIcon.svg";
import HomeCalender from "../../components/pages/home/calender";
import { IHistory, ITask, useTask } from "../../api/task/taskHook";
import axios from "axios";
import useUser from "../../hooks/useUser";
import { useTracker } from "../../api/tracker/trackerHook";

export default function HomePage() {
  const [notif, contextHolder] = notification.useNotification();

  const [newHabbitModal, setNewHabbitModal] = useState(false);
  const { findAll, summery } = useTask();
  // const tasks = findAll?.data;
  const homeData = summery?.data?.streaks;
  const tasks = summery?.data?.tasks;
  const { homeTrackers } = useTracker();
  const history = homeTrackers?.data;

  console.log("homedata", homeData);

  const { user } = useUser();
  return (
    <Row justify={"center"} gutter={[16, 16]}>
      <Col span={24}>
        <h1 className={style.title}>good morning, {user.name}</h1>
      </Col>
      <Col span={8}>
        <StatCard title="great job" icon={smileIcon} bgColor="#FFF2F8">
          last month was your best week, you can do it again!
        </StatCard>
      </Col>
      <Col span={8}>
        <StatCard
          title="current streak"
          icon={streakIcon}
          bgColor="linear-gradient(180deg, rgba(41, 230, 130, 0.11) 0%, rgba(146, 255, 95, 0.00) 100%)"
          data={homeData?.maxCurrentStreak ?? 0}
        ></StatCard>
      </Col>
      <Col span={8}>
        <StatCard
          title="Longest streak"
          icon={streakIcon}
          bgColor="linear-gradient(180deg, rgba(41, 230, 130, 0.34) 0%, rgba(0, 255, 38, 0.18) 77.5%, rgba(146, 255, 95, 0.00) 100%)"
          data={homeData?.maxLongestStreak ?? 0}
        ></StatCard>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          {(tasks ?? []).map((task: any, index: any) => {
            const icon = taskIcons.find((i) => i.id == task.icon)?.icon;
            const color = colors.find((i) => i.id == task.color)?.code;

            return (
              <Col key={task._id} span={8}>
                <Link to={`/task/${task._id}`}>
                  <Button
                    type="text"
                    className={style.taskbtn}
                    style={{
                      height: "100%",
                      border: "none",
                      width: "100%",
                      padding: 0,
                    }}
                  >
                    <Card style={{ background: color }}>
                      <Row
                        wrap={false}
                        gutter={[16, 16]}
                        justify={"space-between"}
                      >
                        <Col flex={"219px"}>
                          <Row>
                            <Col span={24}>
                              <h1 className={style.taskTitle}>{task.title}</h1>
                            </Col>
                            <Col span={24}>
                              <p className={style.taskPercent}>{`%${Math.min(
                                Number(task?.percent),
                                100
                              )}`}</p>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <Progress
                            type="circle"
                            percent={task?.percent}
                            strokeColor={"black"}
                            format={(e) => (
                              <Row justify={"center"} gutter={[16, 16]}>
                                <Col span={24}>
                                  {icon ? <img src={icon} /> : null}
                                </Col>
                              </Row>
                            )}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Button>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Col>
      <Col>
        <button className="pbtn" onClick={() => setNewHabbitModal(true)}>
          <Row gutter={[4, 4]} align={"middle"}>
            <Col>
              <img src={plusicon} className={style.iconContainer} />
            </Col>
            <Col>
              <Typography>new habit</Typography>
            </Col>
          </Row>
        </button>

        {/* <button
          className="pbtn"
          onClick={async () => {
            axios
              .post("/task/mock")
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
            notif["success"]({
              message: "ورود موفق",
            });
          }}
        >
          <Row gutter={[4, 4]} align={"middle"}>
            <Col>
              <img src={plusicon} className={style.iconContainer} />
            </Col>
            <Col>
              <Typography>test</Typography>
            </Col>
          </Row>
        </button> */}
      </Col>
      <Col span={24}>
        <h2>Calender</h2>
      </Col>
      <HomeCalender history={history ?? []} schedule={[]} />
      <NewHabitModal show={newHabbitModal} setShow={setNewHabbitModal} />
      {contextHolder}
    </Row>
  );
}
