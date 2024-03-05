import { publicAxios } from "@/../lib/axios";
import { RegisterDataType } from "../../validation/registerSchema";
import { AxiosInstance } from "axios";
import { ChangePasswordDataType } from "../../validation/changePasswordSchema";
import { User } from "@/../types/next-auth";

export const registerAccount = async (data: RegisterDataType) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await res.json();

  if (!res.ok) {
    return Promise.reject(responseData);
  }

  return responseData;
};

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

export const logout = async (axiosAuth: AxiosInstance) => {
  try {
    const res = await axiosAuth.post("/auth/logout");

    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const verifyUsername = async (
  value: string,
  currentUsername: string = ""
) => {
  if (value === currentUsername) {
    return true;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify/username`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: value }),
    }
  );

  const responseData = await response.json();

  if (response.ok) {
    console.log({ responseData });
    return true;
  } else {
    console.log({ responseData });
    return false;
  }
};

export const verifyEmail = async (value: string, currentEmail: string = "") => {
  if (value === currentEmail) {
    return true;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: value }),
    }
  );

  const responseData = await response.json();

  if (response.ok) {
    console.log({ responseData });
    return true;
  } else {
    console.log({ responseData });
    return false;
  }
};

export const changePassword = async (
  axios: AxiosInstance,
  data: ChangePasswordDataType
) => {
  try {
    const res = await axios.put<User>("/user/update/password", data);

    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};
