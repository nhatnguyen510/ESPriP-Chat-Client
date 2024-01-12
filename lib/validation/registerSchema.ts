import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
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
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/, {
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
    avatar: z.object({
      image: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    }),
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: "Passwords must match",
    path: ["confirmed_password"],
  });
export type FormData = z.infer<typeof schema>;
