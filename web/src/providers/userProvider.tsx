import axios from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
interface IState {
  name: string;
  avatar: string;
  userType: string;
  id: string;
  token: string;
  isAuthenticated: boolean | null;
}

export const UserDispatcherContext = createContext<Dispatch<
  SetStateAction<IState>
> | null>(null);
export const UserContext = createContext<IState>({
  name: "",
  avatar: "",
  userType: "",

  id: "",
  token: "",
  isAuthenticated: null,
});
// React.FC

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IState>({
    name: "",
    avatar: "",
    userType: "",
    id: "",
    token: "",
    isAuthenticated: null,
  });
  useEffect(() => {
    const name = localStorage.getItem("name");
    const avatar = localStorage.getItem("avatar");
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const id = localStorage.getItem("id");

    if (token && name) {
      setState({
        name: name ?? "",
        avatar: avatar ?? "",
        token: token ?? "",
        userType: userType ?? "",
        id: id ?? "",
        isAuthenticated: true,
      });
      if (token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      setState({
        name: "",
        avatar: "",
        token: "",
        userType: "",

        id: "",
        isAuthenticated: false,
      });
    }
  }, []);
  return (
    <UserDispatcherContext.Provider value={setState}>
      <UserContext.Provider value={state}>
        {state.isAuthenticated === null ? <></> : children}
      </UserContext.Provider>
    </UserDispatcherContext.Provider>
  );
};
