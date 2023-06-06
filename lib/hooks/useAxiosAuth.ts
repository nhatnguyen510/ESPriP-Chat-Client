import { useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import useRefreshToken from "./useRefreshToken";
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CurrentUserReturnType } from "../session";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosAuth = (user: CurrentUserReturnType) => {
  const refreshToken = useRefreshToken(user);

  const router = useRouter();

  useEffect(() => {
    const onRequest = (config: any) => {
      if (user?.access_token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${user?.access_token}`,
        };
        console.log("Headers: ", config.headers);
      }
      return config;
    };

    const onErrorRequest = (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
    };

    const onResponse = (response: AxiosResponse): AxiosResponse => {
      return response;
    };

    const onErrorResponse = async (
      error: AxiosError
    ): Promise<AxiosError | void> => {
      const prevRequest = error?.config as InternalAxiosRequestConfig;
      console.log("This is the error: ", error);
      if (error?.response?.status === 403) {
        console.log("Access token: ", prevRequest?.headers?.Authorization);
        try {
          const newAccessToken = await refreshToken();

          console.log("New access token: ", newAccessToken);
          if (newAccessToken) {
            prevRequest.headers = {
              ...prevRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            } as InternalAxiosRequestConfig["headers"];
            console.log("Prev request: ", prevRequest);
            user!.access_token = newAccessToken;
            return axiosInstance(prevRequest);
          }
        } catch (err) {
          console.log("Something went wrong while refreshing token: ", err);
          const signOutResponse = await signOut({
            redirect: false,
            callbackUrl: "/login",
          });

          router.push(signOutResponse?.url);
        }
      } else {
        return Promise.reject(error);
      }
    };
    const requestIntercept = axiosInstance.interceptors.request.use(
      onRequest,
      onErrorRequest
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      onResponse,
      onErrorResponse
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return axiosInstance;
};

export default useAxiosAuth;
