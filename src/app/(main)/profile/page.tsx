"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  schema,
  UpdateUserDataType,
} from "@/../lib/validation/updateUserSchema";
import Input from "@/app/components/RegisterInput";
import { zodResolver } from "@hookform/resolvers/zod";
import useRefinement, {
  RefinementCallback,
} from "@/../lib/hooks/useRefinement";
import { verifyUsername, verifyEmail } from "@/../lib/api/auth";
import Image from "next/image";
import FormData from "form-data";
import { useSession } from "next-auth/react";

interface pageProps {}

export default function Profile(props: pageProps) {
  const { data: session } = useSession();

  const user = session?.user;

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const checkNameToBeUnique = (): RefinementCallback<UpdateUserDataType> => {
    return async (data) => {
      return await verifyUsername(data.username);
    };
  };

  const checkEmailToBeUnique = (): RefinementCallback<UpdateUserDataType> => {
    return async (data) => {
      return await verifyEmail(data.email);
    };
  };

  const uniqueName = useRefinement(checkNameToBeUnique(), {
    debounce: 1000,
  });

  const uniqueEmail = useRefinement(checkEmailToBeUnique(), {
    debounce: 1000,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateUserDataType>({
    defaultValues: {
      username: user?.username,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email as string,
      avatar: {},
    },
    resolver: zodResolver(
      schema
        .refine(uniqueName, {
          message: "Username is already taken",
          path: ["username"],
        })
        .refine(uniqueEmail, {
          message: "Email is already taken",
          path: ["email"],
        })
    ),
    mode: "onSubmit",
  });

  const watchAvatar = watch("avatar");

  const onSubmit: SubmitHandler<UpdateUserDataType> = async (data) => {
    setIsLoading(true);

    console.log("data: ", data);

    try {
      // Make a request to the server to update the user's profile
      const avatar = data.avatar[0];
      const formData = new FormData();

      formData.append("file", avatar);
      formData.append("upload_preset", "esprip-chat-images");

      const uploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dicuu83mu/image/upload",
        {
          method: "POST",
          body: formData as any,
        }
      );

      const uploadResult = await uploadResponse.json();

      console.log("uploadResult: ", uploadResult);
    } catch (err) {
      console.log("err: ", err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    reset({
      username: user?.username,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email as string,
      avatar: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="flex h-screen flex-col gap-4 p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="flex w-1/4 flex-col">
            <h3>Personal Information</h3>
            <p className="text-xs text-gray-300">
              Use a permanent address where you can receive email
            </p>
          </div>
          <div className="w-3/4 p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center gap-2">
                <Image
                  src={
                    watchAvatar.length
                      ? URL.createObjectURL(watchAvatar[0])
                      : "/avatar-cute-2.jpeg"
                  }
                  alt="avatar"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full"
                />
                <input
                  {...register("avatar")}
                  type="file"
                  accept="image/*"
                  className="
                  rounded border border-gray-300 p-2 text-sm  text-gray-900 focus:border-gray-300        
                  focus:outline-none
                  focus:ring-0
                "
                />
              </div>
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.avatar?.message as any}
                </p>
              )}
              <Input
                id="username"
                label="Username"
                defaultValue={user?.username}
                disabled={!!isLoading}
                control={control}
                onChange={() => {
                  uniqueName.invalidate();
                }}
                errors={errors}
                required={true}
              />
              {/* Display error for username field */}
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username?.message}
                </p>
              )}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    id="first_name"
                    label="First Name"
                    defaultValue={user?.first_name}
                    disabled={!!isLoading}
                    control={control}
                    errors={errors}
                    required={true}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.first_name?.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <Input
                    id="last_name"
                    label="Last Name"
                    defaultValue={user?.last_name}
                    disabled={!!isLoading}
                    errors={errors}
                    control={control}
                    required={true}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.last_name?.message}
                    </p>
                  )}
                </div>
              </div>
              <Input
                id="email"
                label="Email"
                type="email"
                defaultValue={user?.email}
                disabled={!!isLoading}
                control={control}
                onChange={() => {
                  uniqueEmail.invalidate();
                }}
                errors={errors}
                required={true}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email?.message}
                </p>
              )}
              <div className="my-4 flex items-center justify-end space-x-4">
                <Button
                  color="danger"
                  variant="ghost"
                  onClick={() => {
                    reset();
                  }}
                  className="text-red-500"
                >
                  Cancel
                </Button>
                <Button color="success" onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div>Change password</div>
      </div>
    </>
  );
}
