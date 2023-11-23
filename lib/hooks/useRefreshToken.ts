import { publicAxios } from "../axios";
import mem from "mem";
import { CurrentUserReturnType } from "../session";
import { refresh } from "../api/auth";
import { useSession } from "next-auth/react";

const useRefreshToken = (user: CurrentUserReturnType) => {
  const refreshToken = async () => {
    try {
      return await refresh(
        user?.refresh_token as string,
        user?.refresh_token_id as string
      );
    } catch (err) {
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
