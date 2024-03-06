import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
  Typography,
  notification,
} from "antd";
import newhabiticon from "../../../../assets/img/home/newhabiticon.svg";
import style from "./index.module.css";
import { taskIcons } from "../../../../assets/taskIcons";
import { colors } from "../../../../assets/colors";
import { weekDays } from "../../../../assets/weekDays";
import { Dispatch, SetStateAction, useState } from "react";
import { ITask, useTask } from "../../../../api/task/taskHook";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);
const { Title } = Typography;
const { RangePicker } = DatePicker;
const weekFormat = "MM/DD";
const dateFormat = "YYYY/MM/DD";
const customWeekStartEndFormat: DatePickerProps["format"] = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;
export default function NewHabitModal({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const [notif, contextHolder] = notification.useNotification();

  const [newTask, setNewTask] = useState<ITask>({});
  const { create } = useTask();

  return (
    <Modal
      title={
        <Row gutter={[4, 4]}>
          <Col>
            <img src={newhabiticon} />
          </Col>
          <Col>
            <Row>
              <Col span={24}>
                <h1 className={style.title}>new habit</h1>
              </Col>
              <Col className={style.description}>
                The best time to start, is now! You got this!
              </Col>
            </Row>
          </Col>
        </Row>
      }
      open={show}
      footer={false}
      // onOk={handleOk}
      onCancel={() => setShow(false)}
    >
      <Row style={{ paddingTop: 15 }} gutter={[16, 16]} justify={"center"}>
        <Col span={24}>
          <Row>
            <Col>
              <h2 className={style.title2}>i want to</h2>
            </Col>
            <Col>
              <Input
                value={newTask.title}
                placeholder="new habit..."
                className={style.input}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{ paddingTop: 20 }}>
          <h2 className={style.title2}>iconography</h2>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {taskIcons.map((taskIcon) => {
              const activeClass =
                newTask?.icon === taskIcon.id
                  ? ` ${style.iconitem_active}`
                  : ``;
              return (
                <Col key={taskIcon.id}>
                  <Button
                    className={style.iconitem + activeClass}
                    onClick={() => {
                      setNewTask((prev) => ({
                        ...prev,
                        icon: taskIcon.id,
                      }));
                    }}
                  >
                    <img src={taskIcon.icon} />
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={24} style={{ paddingTop: 20 }}>
          <h2 className={style.title2}>color</h2>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {colors.map((color) => {
              const activeClass =
                newTask?.color === color.id ? ` ${style.color_active}` : ``;
              return (
                <Col key={color.id}>
                  <Button
                    className={style.iconitem + activeClass}
                    style={{ background: color.code, borderRadius: "50%" }}
                    onClick={() => {
                      setNewTask((prev) => ({
                        ...prev,
                        color: color.id,
                      }));
                    }}
                  ></Button>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={24} style={{ paddingTop: 20 }}>
          <h2 className={style.title2}>schedule</h2>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {weekDays.map((weekDay) => {
              let index = (newTask.schedule ?? []).findIndex(
                (i) => i == weekDay.id
              );
              let isActive = index > -1;
              const activeClass = isActive ? ` ${style.color_active}` : ``;
              return (
                <Col key={weekDay.id}>
                  <Button
                    className={style.iconitem + activeClass}
                    style={{ borderRadius: "50%" }}
                    onClick={() => {
                      setNewTask((prev) => {
                        let pervColors = [...(prev.schedule ?? [])];

                        if (index == -1) pervColors.push(weekDay.id);
                        else pervColors.splice(index, 1);
                        return {
                          ...prev,
                          schedule: [...pervColors],
                        };
                      });
                    }}
                  >
                    {weekDay.code}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Col>

        {/* <Col span={24} style={{ paddingTop: 20 }}>
          <Checkbox
            checked={newTask.repeatable}
            onChange={(e) => {
              const val = e.target.checked;
              setNewTask((prev) => ({
                ...prev,
                repeatable: val,
              }));
            }}
          />
          {"  repeatable"}
        </Col> */}
        <Col span={24} style={{ paddingTop: 20 }}>
          <h2 className={style.title2}>Date range</h2>
        </Col>
        <Col span={24}>
          <RangePicker
            style={{ width: "100%" }}
            picker="week"
            value={
              newTask?.startDate && newTask?.endDate
                ? [dayjs(newTask?.startDate), dayjs(newTask?.endDate)]
                : null
            }
            format={customWeekStartEndFormat}
            className={style.input}
            // onChange={(e) => console.log(e)}
            onChange={(e) => {
              setNewTask((prev) => ({
                ...prev,
                startDate: dayjs(e?.[0]).startOf("week").toDate(),
                endDate: dayjs(e?.[1]).endOf("week").toDate(),
              }));
            }}
          />
        </Col>
        <Col span={24} style={{ paddingTop: 20 }}>
          <Checkbox
            checked={newTask.hasDuration}
            onChange={(e) => {
              const val = e.target.checked;
              setNewTask((prev) => ({
                ...prev,
                hasDuration: val,
              }));
            }}
          />
          {"  Has duration"}
        </Col>
        <Col span={24}>
          <InputNumber
            value={newTask.duration}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, duration: e ?? 0 }))
            }
            placeholder="duration"
            className={style.input}
            disabled={!newTask.hasDuration}
          />
        </Col>
        <Col span={24}>
          <InputNumber
            value={newTask.timesPerDay}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, timesPerDay: e ?? 0 }))
            }
            placeholder="this task should run ... times a day"
            className={style.input}
          />
        </Col>
        <Col>
          <button
            className="pbtn"
            style={{ borderRadius: 10 }}
            onClick={() => {
              create
                .mutateAsync(newTask)
                .then((res) => {
                  setNewTask({});
                  setShow(false);
                })
                .catch((err) => {
                  notif["error"]({
                    message: "failed to create task",
                    description:
                      err?.response?.data?.message ?? "Connection Error",
                  });
                  console.log(err?.response?.data ?? "Connection Error");
                });
            }}
          >
            <Typography>
              {create.isPending ? <Spin /> : "Start new habit"}
            </Typography>
          </button>
        </Col>
      </Row>
      {contextHolder}
    </Modal>
  );
}
