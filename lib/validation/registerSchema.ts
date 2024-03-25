import { z } from "zod";
import _ from "lodash";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const schema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Must be greater than 4 letters" })
      .max(20, { message: "Must be smaller than 20 letters" }),
    password: z
      .string()
      .min(8, { message: "Must be greater than 8 letters" })
      .max(20, { message: "Must be smaller than 20 letters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/, {
        message:
          "Must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      }),
    first_name: z
      .string()
      .min(4, { message: "Must be greater than 4 letters" })
      .max(20, { message: "Must be smaller than 20 letters" }),
    last_name: z
      .string()
      .min(4, { message: "Must be greater than 4 letters" })
      .max(20, { message: "Must be smaller than 20 letters" }),
    email: z.string().email({ message: "Invalid email" }),
    confirmed_password: z
      .string()
      .min(8, { message: "Must be greater than 8 letters" })
      .max(20, { message: "Must be smaller than 20 letters" }),
    avatar_url: z
      .any()
      .optional()
      .refine(
        (files) => {
          return (
            _.isEmpty(files) ||
            files.length === 0 ||
            (files.length === 1 &&
              files[0].size <= MAX_FILE_SIZE &&
              ACCEPTED_IMAGE_TYPES.includes(files[0].type))
          );
        },
        {
          message:
            "If provided, avatar must be a valid file with max size 1MB and one of the supported types: image/jpeg, image/jpg, image/png, image/webp.",
        }
      ),
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: "Passwords must match",
    path: ["confirmed_password"],
  });
export type RegisterDataType = z.infer<typeof schema>;
