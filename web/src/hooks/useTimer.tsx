import dayjs from "dayjs";
import { useState, useEffect } from "react";
export const durationConvertor = (duration: number) =>
  `${
    Math.floor(duration / (3600 * 24)) > 0
      ? `${Math.floor(duration / (3600 * 24))} days`
      : ""
  } ${Math.floor((duration % (3600 * 24)) / 3600)}:${Math.floor(
    ((duration % (3600 * 24)) % 3600) / 60
  )}:${Math.floor(((duration % (3600 * 24)) % 3600) % 60)}`;

const useTimer = (start: Date) => {
  const [duration, setDuration] = useState(0);
  console.log("dure", duration);
  const [state, setState] = useState<"stop" | "start">("stop");
  useEffect(() => {
    console.log(Math.floor(dayjs().diff(dayjs(start)) / 1e3));
    setDuration(Math.floor(dayjs().diff(dayjs(start)) / 1e3));
  }, [start]);
  useEffect(() => {
    let timer: any;
    timer = setInterval(() => {
      console.log("dur");
      setDuration((dur) => dur + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [state]);
  return {
    timer: durationConvertor(duration),
    setState,
  };
};

export { useTimer };
