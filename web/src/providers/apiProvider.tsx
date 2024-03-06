import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import jMoment from "moment-jalaali";

const models = {
  task: {},
  tracker: {},
  homeTrackers: {},
  summery: {},
};
export type ModelKeys = keyof typeof models;
export type IFilter = {
  name: string;
  operator: string;
  value: any;
  type?: string;
};
export type IOrder = [string, "DESC" | "ASC"];
export type IApi = {
  [K in ModelKeys]?: UseQueryResult<any, Error>;
};
export type IQueryValue = {
  search?: string;
  filters?: IFilter[];
  order?: IOrder[];
};
export type IQuery = {
  [K in ModelKeys]?: IQueryValue;
};

export const ApiContext = createContext<IApi>({});
export const QueryContext = createContext<IQuery>({});
export const QueryDispatchContext = createContext<
  Dispatch<SetStateAction<IQuery>>
>((prev) => null);

export const ApiProvider = ({ children }: PropsWithChildren) => {
  const [query, setQuery] = useState<IQuery>({
    // order: {
    //   filters: [
    //     {
    //       name: "status",
    //       operator: "eq",
    //       value: "pending",
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    // },
    // dashboard: {
    //   filters: [
    //     {
    //       name: "createdAt",
    //       operator: "gte",
    //       value: jMoment().startOf("day"),
    //       type: "date",
    //     },
    //     {
    //       name: "status",
    //       operator: "eq",
    //       value: "pending",
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    // },
    task: {},
  });
  const alltask = useQuery({
    queryKey: ["task", query?.task],
    queryFn: async () => {
      const res = await axios.get("task", {
        params: query.task,
      });
      console.log("tasks", res.data);
      return res.data;
    },
  });
  const summery = useQuery({
    queryKey: ["summery", query?.task],
    queryFn: async () => {
      const res = await axios.get("task/summery", {
        params: query.task,
      });
      console.log("summery", res.data?.tasks);
      return res.data;
    },
  });
  const homeTrackers = useQuery({
    queryKey: ["tracker", query?.tracker],
    queryFn: async () => {
      const res = await axios.get("tracker/home", {
        params: query.tracker,
      });
      return res.data;
    },
  });

  return (
    <QueryDispatchContext.Provider value={setQuery}>
      <QueryContext.Provider value={query}>
        <ApiContext.Provider value={{ task: alltask, homeTrackers, summery }}>
          {children}
        </ApiContext.Provider>
      </QueryContext.Provider>
    </QueryDispatchContext.Provider>
  );
};
