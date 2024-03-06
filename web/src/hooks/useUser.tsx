import axios from "axios";
import { useState, createContext, useContext } from "react";
import { UserContext, UserDispatcherContext } from "../providers/userProvider";

export const useUser = () => {
  const setState = useContext(UserDispatcherContext);
  const state = useContext(UserContext);
  const login = (data: {
    name: string;
    avatar: string;
    access_token: string;
    userType: string;
    id: string;
  }) => {
    if (setState) {
      setState({ ...data, isAuthenticated: true, token: data?.access_token });
      localStorage.setItem("name", data?.name);
      localStorage.setItem("avatar", data?.avatar);
      localStorage.setItem("token", data?.access_token);
      localStorage.setItem("userType", data?.userType);
      localStorage.setItem("id", data?.id);
      if (data?.access_token)
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data?.access_token}`;
    }
  };
  const logout = () => {
    if (setState)
      setState({
        name: "",
        avatar: "",
        token: "",
        userType: "",
        id: "",
        isAuthenticated: false,
      });
    localStorage.removeItem("name");
    localStorage.removeItem("avatar");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("id");
    axios.defaults.headers.common["Authorization"] = ``;
  };
  return { user: state, login, logout };
};
export default useUser;
