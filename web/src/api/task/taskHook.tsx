import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { ApiContext } from "../../providers/apiProvider";
export interface IHistory {
  _id?: string | number;
  start?: Date;
  end?: Date;
  isActive?: boolean;
  duration?: number;
  address?: string;
  owner?: string;
  task?: string;
}
export interface ITask {
  _id?: string | number;
  icon?: number;
  color?: number;
  timesPerDay?: number;
  hasDuration?: boolean;
  duration?: number;
  title?: string;
  schedule?: number[];
  repeatable?: boolean;
  currentStreak?: number;
  longestStreak?: number;
  startDate?: Date;
  endDate?: Date;
  history?: IHistory[];
}

export const useTask = () => {
  //   const { user } = useUser();
  const queryClient = useQueryClient();
  const findAll = useContext(ApiContext)?.task;
  const summery = useContext(ApiContext)?.summery;

  const create = useMutation({
    mutationFn: (state: ITask) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`task`, state);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskSingle"] });
      queryClient.invalidateQueries({ queryKey: ["summery"] });
      queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });
  const update = useMutation({
    mutationFn: (state: ITask) => {
      return new Promise(async (resolve, reject) => {
        try {
          const { _id, ...rest } = state;
          const res = await axios.patch(`task/${_id}`, rest);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskSingle"] });
      queryClient.invalidateQueries({ queryKey: ["summery"] });
      queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });
  const destroy = useMutation({
    mutationFn: (state: ITask) => {
      return new Promise(async (resolve, reject) => {
        try {
          const { _id, ...rest } = state;
          const res = await axios.delete(`task/${_id}`);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskSingle"] });
      queryClient.invalidateQueries({ queryKey: ["summery"] });
      queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });
  return { summery, create, findAll, update, destroy };
};
