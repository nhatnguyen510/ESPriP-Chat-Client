import { publicAxios } from "../axios";
import mem from "mem";
import { CurrentUserReturnType } from "../session";
import { refresh } from "../api/auth";

const useRefreshToken = (user: CurrentUserReturnType) => {
  const refreshToken = async () => {
    console.log("Access token before refresh: ", user?.access_token);
    try {
      return await refresh(
        user?.refresh_token as string,
        user?.refresh_token_id as string
      );
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
