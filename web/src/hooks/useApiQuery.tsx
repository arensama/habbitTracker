import axios from "axios";
import { useState, createContext, useContext } from "react";
import {
  IFilter,
  IQueryValue,
  ModelKeys,
  QueryContext,
  QueryDispatchContext,
} from "../providers/apiProvider";

export const useApiQuery = () => {
  const setState = useContext(QueryDispatchContext);
  const state = useContext(QueryContext);
  const setQuery = (model: ModelKeys, type: keyof IQueryValue, value: any) => {
    setState((prev) => {
      return {
        ...prev,
        [model]: {
          ...prev[model],
          [type]: value,
        },
      };
    });
  };
  const setFilter = (model: ModelKeys, value: IFilter) => {
    setState((prev) => {
      let prevFilters = prev?.[model]?.filters ?? [];
      let index = prevFilters.findIndex((i) => i.name === value.name);
      if (index > -1) {
        prevFilters[index] = value;
      } else prevFilters.push(value);
      return {
        ...prev,
        [model]: {
          ...prev[model],
          filter: [...prevFilters],
        },
      };
    });
  };
  const getFilter = (model: ModelKeys, name: string) => {
    return (state[model]?.filters ?? []).find((i) => i.name === name);
  };
  return {
    setQuery,
    query: state,
    setFilter,
    getFilter,
  };
};
