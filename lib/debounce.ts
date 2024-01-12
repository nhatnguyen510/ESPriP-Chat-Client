import { debounce } from "lodash";
import * as yup from "yup";

const verifyUsername = async (
  value: string,
  testContext: yup.TestContext,
  resolve: (val: boolean) => void
) => {
  console.log({ value, testContext });
  const response = await fetch("/api/v1/auth/verify/username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: value }),
  });

  const responseData = await response.json();

  if (response.ok) {
    console.log({ responseData });
    return resolve(true);
  } else {
    console.log({ responseData });
    return resolve(false);
  }
};

const verifyEmail = async (
  value: string,
  testContext: yup.TestContext,
  resolve: (val: boolean) => void
) => {
  const response = await fetch("/api/v1/auth/verify/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: value }),
  });

  const responseData = await response.json();

  if (response.ok) {
    console.log({ responseData });
    return resolve(true);
  } else {
    console.log({ responseData });
    return resolve(false);
  }
};

export const debounceVerifyUsername = debounce(verifyUsername, 2000);

export const debounceVerifyEmail = debounce(verifyEmail, 2000);
