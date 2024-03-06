import {
  Button,
  Card,
  Col,
  Popconfirm,
  Progress,
  Row,
  Table,
  Typography,
  notification,
} from "antd";
import style from "./index.module.css";
import plusicon from "../../../src/assets/img/home/plus.svg";
import NewHabitModal from "../../components/pages/home/newmodal";
import { useState } from "react";
import { taskIcons } from "../../assets/taskIcons";
import { colors } from "../../assets/colors";
import { Link, useNavigate, useParams } from "react-router-dom";
import circlebtm from "../../assets/img/task/circlebtm.svg";
import circletop from "../../assets/img/task/circletop.svg";
import StatCard from "../../components/pages/task/statCard";

import smileIcon from "../../assets/img/task/smile.svg";
import recordIcon from "../../assets/img/task/recordIcon.svg";
import streakIcon from "../../assets/img/task/streakIcon.svg";
import dayjs from "dayjs";
import TaskCalender from "../../components/pages/task/calender";
import { FaCirclePlay } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaTrash } from "react-icons/fa6";
import { useTask } from "../../api/task/taskHook";
import { useTracker } from "../../api/tracker/trackerHook";
export default function TaskPage() {
  const params = useParams();
  const [notif, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { create } = useTracker();

  const { update, destroy } = useTask();
  const taskQuery = useQuery({
    queryKey: ["taskSingle"],
    queryFn: async () => {
      const res = await axios.get(`task/${params?.id}`, {});
      console.log("tasks", res.data);
      return res.data;
    },
  });
  const task = taskQuery.data;
  const icon = taskIcons.find((i) => i.id == task?.icon)?.icon;
  const color = colors.find((i) => i.id == task?.color)?.code;

  return (
    <Row justify={"space-between"} gutter={[16, 16]}>
      <Col span={24}>
        <Card bordered={false} style={{ background: color }}>
          <Button
            onClick={() => {
              create
                .mutateAsync({
                  task: task?._id,
                })
                .then((res: any) => {
                  console.log("addnewTracker", res?.data);
                })
                .catch((err) => {
                  notif["error"]({
                    message: "failed to create Tracker",
                    description:
                      err?.response?.data?.message ?? "Connection Error",
                  });
                  console.log(err?.response?.data ?? "Connection Error");
                });
            }}
            type="text"
            style={{
              position: "absolute",
              top: "calc(50% - 50px)",
              right: "calc(50% - 29px)",
              fontSize: 90,
              zIndex: 2,
              height: 80,
              width: 80,
              padding: 10,
              borderRadius: "50%",
              display: "flex",
            }}
          >
            <FaCirclePlay />
          </Button>
          <div className={style.bg}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <img src={circletop} style={{ width: 200, height: 100 }} />
              <p className={style.percent}>{`%${Math.min(
                Number(task?.percent),
                100
              )}`}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <img src={circlebtm} style={{ width: 200, height: 100 }} />
            </div>
          </div>

          <Row style={{ marginTop: 170 }}>
            <Col span={24}></Col>
            <Col>{icon && <img src={icon} className={style.icon} />}</Col>
            <Col>
              <h1 className={style.title}>{task?.title}</h1>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Progress
          percent={task?.percent}
          strokeColor={{ from: "#108ee9", to: "#87d068" }}
          showInfo={false}
          status="active"
        />
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
          // data={task?.currentStreak}
          data={task?.streaks?.maxCurrentStreak ?? 0}
        ></StatCard>
      </Col>
      <Col span={8}>
        <StatCard
          title="Longest streak"
          icon={streakIcon}
          bgColor="linear-gradient(180deg, rgba(41, 230, 130, 0.34) 0%, rgba(0, 255, 38, 0.18) 77.5%, rgba(146, 255, 95, 0.00) 100%)"
          data={task?.streaks?.maxLongestStreak ?? 0}
        ></StatCard>
      </Col>
      <Col span={24}>
        <Row justify={"center"}>
          <Col>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() =>
                destroy
                  .mutateAsync(task)
                  .then((res) => {
                    navigate("/");
                  })
                  .catch((err) => {
                    notif["error"]({
                      message: "failed to delete task",
                      description:
                        err?.response?.data?.message ?? "Connection Error",
                    });
                    console.log(err?.response?.data ?? "Connection Error");
                  })
              }
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <button
                className="pbtn"
                style={{ width: 200, background: "#F34E4E" }}
              >
                <FaTrash />
              </button>
            </Popconfirm>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <TaskCalender
          history={task?.tracker ?? []}
          schedule={task?.schedule ?? []}
        />
      </Col>
      {contextHolder}
    </Row>
  );
}
