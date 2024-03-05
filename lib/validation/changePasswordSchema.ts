import { z } from "zod";

export const schema = z
  .object({
    old_password: z
      .string()
      .min(8, { message: "Must be greater than 8 letters" })
      .max(20, { message: "Must be smaller than 20 letters" }),
    new_password: z
      .string()
      .min(8, { message: "Must be greater than 8 letters" })
      .max(20, { message: "Must be smaller than 20 letters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/, {
        message:
          "Must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      }),
    confirmed_new_password: z
      .string()
      .min(8, { message: "Must be greater than 8 letters" })
      .max(20, { message: "Must be smaller than 20 letters" }),
  })
  .refine((data) => data.new_password === data.confirmed_new_password, {
    message: "Passwords must match",
    path: ["confirmed_new_password"],
  });
export type ChangePasswordDataType = z.infer<typeof schema>;
