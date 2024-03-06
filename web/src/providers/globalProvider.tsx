import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

export interface IGlobalData {
  factorId: number;
}

export const GlobalDataDispatchContext = createContext<Dispatch<IGlobalData>>(
  (prev: IGlobalData) => {}
);
export const GlobalDataContext = createContext<IGlobalData>({
  factorId: 0,
});

export const GlobalDataProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<IGlobalData>({
    factorId: 0,
  });
  return (
    <GlobalDataDispatchContext.Provider value={setState}>
      <GlobalDataContext.Provider value={state}>
        {children}
      </GlobalDataContext.Provider>
    </GlobalDataDispatchContext.Provider>
  );
};
