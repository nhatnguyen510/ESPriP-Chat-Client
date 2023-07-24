import * as yup from "yup";
import { debounceVerifyUsername, debounceVerifyEmail } from "../debounce";

const schema = yup
  .object()
  .shape({
    username: yup
      .string()
      .required()
      .test(
        "valid username",
        "Username is already taken",
        (value, testContext) =>
          new Promise((resolve) =>
            debounceVerifyUsername(value, testContext, resolve)
          )
      ),

    password: yup.string().required(),
    first_name: yup
      .string()
      .required()
      .min(5, "Must be greater than 5 letters")
      .max(10, "Must be smaller than 10 letters"),
    last_name: yup
      .string()
      .required()
      .min(5, "Must be greater than 5 letters")
      .max(10, "Must be smaller than 10 letters"),
    email: yup
      .string()
      .email("Invalid email")
      .required()
      .test(
        "valid email",
        "Email is already taken",
        (value, testContext) =>
          new Promise((resolve) =>
            debounceVerifyEmail(value, testContext, resolve)
          )
      ),
    confirmed_password: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required(),
  })
  .required();

export type FormData = yup.InferType<typeof schema>;

export default schema;
