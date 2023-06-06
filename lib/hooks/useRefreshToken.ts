import { publicAxios } from "../axios";
import mem from "mem";
import { CurrentUserReturnType } from "../session";

const useRefreshToken = (user: CurrentUserReturnType) => {
  const refreshToken = async () => {
    console.log("Access token before refresh: ", user?.access_token);
    try {
      const res = await publicAxios.post(`/auth/token/refresh-token`, {
        refresh_token: user?.refresh_token,
      });

      return res.data.access_token as string;
    } catch (err) {
      console.log("Something went wrong while refreshing token: ", err);
      return Promise.reject(err);
    }
  };

  const maxAge = 10000;

  const memoizedRefreshToken = mem(refreshToken, {
    maxAge,
  });

  return memoizedRefreshToken;
};

export default useRefreshToken;
