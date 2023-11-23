import { useEffect } from "react";
import axios, { AxiosInstance, AxiosInterceptorManager } from "axios";
import useRefreshToken from "./useRefreshToken";
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { CurrentUserReturnType } from "../session";
import { getSession, getCsrfToken } from "next-auth/react";
import { refresh } from "../api/auth";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosAuth = () => {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    let requestInterceptor:
      | number
      | AxiosInterceptorManager<AxiosRequestConfig>;
    let responseInterceptor: number | AxiosInterceptorManager<AxiosResponse>;

    const onRequest = async (config: InternalAxiosRequestConfig) => {
      if (user?.access_token) {
        // Create a new headers object to avoid direct mutation
        config.headers.Authorization = `Bearer ${user?.access_token}`;
        config.headers["x-token-id"] = user?.refresh_token_id;
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
      if (error?.response?.status === 401) {
        try {
          const {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
          } = await refresh(
            user?.refresh_token as string,
            user?.refresh_token_id as string
          );

          if (newAccessToken) {
            // Create a new headers object to avoid direct mutation
            const updatedHeaders = {
              ...prevRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

            // const csrfToken = await getCsrfToken();
            // const updatedSession = await getSession({
            //   req: {
            //     body: {
            //       csrfToken,
            //       data: {
            //         user: {
            //           access_token: newAccessToken,
            //           refresh_token: newRefreshToken,
            //         },
            //       },
            //     },
            //   },
            // });
            await update({
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            });

            // Retry the original request with the updated headers
            return axiosInstance({
              ...prevRequest,
              headers: updatedHeaders,
            });
          }
        } catch (err) {
          console.log("Something went wrong while refreshing token: ", err);
          const signOutResponse = await signOut({
            redirect: false,
            callbackUrl: "/login",
          });

          router.push(signOutResponse?.url);
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(error);
      }
    };

    // Set up interceptors
    requestInterceptor = axiosInstance.interceptors.request.use(
      onRequest,
      onErrorRequest
    );

    responseInterceptor = axiosInstance.interceptors.response.use(
      onResponse,
      onErrorResponse
    );

    // Clean up interceptors when the component is unmounted
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor as number);
      axiosInstance.interceptors.response.eject(responseInterceptor as number);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.access_token, user?.refresh_token]);

  return axiosInstance;
};

export default useAxiosAuth;
