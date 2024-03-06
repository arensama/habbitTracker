import { Button, Col, Row } from "antd";
import style from "./index.module.css";
import { useState } from "react";
import { useTimer } from "../../../../hooks/useTimer";
import { BsCheck2 } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { taskIcons } from "../../../../assets/taskIcons";
import { colors } from "../../../../assets/colors";
import { useTracker } from "../../../../api/tracker/trackerHook";
export default function Tracker() {
  const [duration, setDuration] = useState<any>();
  const { activeTracker, end } = useTracker();
  console.log("activeee", activeTracker?.data);

  const tracker = activeTracker?.data;
  const icon = taskIcons.find((i) => i.id == tracker?.task?.icon)?.icon;
  const color = colors.find((i) => i.id == tracker?.task?.color)?.code;
  const { timer } = useTimer(tracker?.start);
  const trackerError = activeTracker.error;
  return (
    !trackerError &&
    tracker?.start && (
      <div className={style.container}>
        <Row
          className={style.body}
          justify="space-between"
          align="middle"
          style={{ background: color }}
        >
          <Col>
            <Row align={"middle"} gutter={[8, 8]}>
              <Col>{icon && <img src={icon} className={style.icon} />}</Col>
              <Col>
                <h1 className={style.title}>{tracker?.task.title}</h1>
              </Col>
            </Row>
          </Col>
          <Col>
            <p>{timer}</p>
          </Col>

          <Col>
            <Row wrap={false}>
              <Col>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    end.mutate({});
                  }}
                  type={"text"}
                >
                  <BsCheck2 className="icon" size={20} />
                </Button>
              </Col>
              {/* <Col>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // destroy.mutate({});
                }}
                type={"text"}
              >
                <IoCloseOutline className="icon" size={20} />
              </Button>
            </Col> */}
            </Row>
          </Col>
        </Row>
      </div>
    )
  );
}
