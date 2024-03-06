import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { ApiContext } from "../../providers/apiProvider";
import useGlobalData from "../../hooks/useGlobalData";
export type ITracker = any;

export const useTracker = () => {
  //   const { user } = useUser();
  const queryClient = useQueryClient();
  // const findAll = useContext(ApiContext)?.tracker;
  const homeTrackers = useContext(ApiContext)?.homeTrackers;
  // const { globalState, setActiveTracker } = useGlobalData();
  const create = useMutation({
    mutationFn: (state: ITracker) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`tracker/add`, state);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTracker"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskSingle"] });
      queryClient.invalidateQueries({ queryKey: ["summery"] });
      queryClient.invalidateQueries({ queryKey: ["tracker"] });
      //   queryClient.invalidateQueries({ queryKey: ["tracker"] });
      //   queryClient.invalidateQueries({ queryKey: ["trackerSingle"] });
    },
  });
  const end = useMutation({
    mutationFn: (state: ITracker) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`tracker/end`);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTracker"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskSingle"] });
      queryClient.invalidateQueries({ queryKey: ["summery"] });
      queryClient.invalidateQueries({ queryKey: ["tracker"] });
      // queryClient.invalidateQueries({ queryKey: ["trackerSingle"] });
    },
  });
  const activeTracker = useQuery({
    queryKey: ["activeTracker"],
    queryFn: async () => {
      const res = await axios.get("tracker/active");
      console.log("active tracker", res.data);
      // setActiveTracker({
      //   id: resdata?.subTaskId,
      //   title: "",
      // });
      return res.data;
    },
  });

  return { create, homeTrackers, end, activeTracker };
};
