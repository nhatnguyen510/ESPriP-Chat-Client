import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const schema = z.object({
  username: z
    .string()
    .min(4, { message: "Must be greater than 4 letters" })
    .max(20, { message: "Must be smaller than 20 letters" }),
  first_name: z
    .string()
    .min(4, { message: "Must be greater than 4 letters" })
    .max(20, { message: "Must be smaller than 20 letters" }),
  last_name: z
    .string()
    .min(4, { message: "Must be greater than 4 letters" })
    .max(20, { message: "Must be smaller than 20 letters" }),
  email: z.string().email({ message: "Invalid email" }),
  avatar: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 1MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type UpdateUserDataType = z.infer<typeof schema>;
