import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

export interface IDrawer {
  drawer?: {
    open: boolean;
    type: "edit" | "create" | "info" | "none";
  };
  data?: any;
}

export const DrawerDispatchContext = createContext<Dispatch<IDrawer>>(
  (prev: IDrawer) => {}
);
export const DrawerContext = createContext<IDrawer>({
  drawer: {
    open: false,
    type: "none",
  },
});

export const DrawerProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<IDrawer>({
    drawer: {
      open: false,
      type: "none",
    },
  });
  return (
    <DrawerDispatchContext.Provider value={setState}>
      <DrawerContext.Provider value={state}>{children}</DrawerContext.Provider>
    </DrawerDispatchContext.Provider>
  );
};
