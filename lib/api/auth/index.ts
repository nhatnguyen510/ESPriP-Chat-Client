import { publicAxios } from "@/../lib/axios";

export const login = async (username: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return Promise.reject(data);
  }

  return data;
};

export const refresh = async (refreshToken: string, xTokenId: string) => {
  try {
    const res = await publicAxios.post<{
      access_token: string;
      refresh_token: string;
    }>(
      "/auth/refresh",
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          "x-token-id": xTokenId,
        },
      }
    );

    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const logout = async (accessToken: string) => {
  try {
    const res = await publicAxios.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};
