import { useContext } from "react";
import {
  IGlobalData,
  GlobalDataContext,
  GlobalDataDispatchContext,
} from "../providers/globalProvider";

const useGlobalData = () => {
  const state = useContext(GlobalDataContext);
  const setStateD = useContext(GlobalDataDispatchContext);
  const setState = (data: IGlobalData) => {
    //@ts-ignore
    setStateD((prev) => ({ ...prev, ...data }));
  };
  const clear = () => {
    setState({
      factorId: 0,
    });
  };
  return { state, setState, clear };
};
export default useGlobalData;
