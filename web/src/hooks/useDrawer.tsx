import { useContext } from "react";
import {
  IDrawer,
  DrawerContext,
  DrawerDispatchContext,
} from "../providers/drawerProvider";

const useDrawer = () => {
  const state = useContext(DrawerContext);
  const setStateD = useContext(DrawerDispatchContext);
  const setState = (data: IDrawer) => {
    //@ts-ignore
    setStateD((prev) => ({ ...prev, ...data }));
  };
  const clear = () => {
    setState({
      drawer: {
        open: false,
        type: "none",
      },
    });
  };
  return { state, setState, clear };
};
export default useDrawer;
