import axios, { AxiosInstance } from "axios";

export const publicAxios: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
