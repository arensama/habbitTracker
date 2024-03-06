import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { ApiContext } from "../../providers/apiProvider";

export interface IAuth {
  username: string;
  password: string;
}

export const useAuth = () => {
  //   const { user } = useUser();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (state: IAuth) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`auth/login`, state);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
  });

  return {
    login,
  };
};
