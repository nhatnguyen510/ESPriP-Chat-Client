import { publicAxios } from "@/../lib/axios";

export const refresh = async (refreshToken: string, xTokenId: string) => {
  try {
    const res = await publicAxios.post(
      "/auth/refresh",
      {
        refreshToken,
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
