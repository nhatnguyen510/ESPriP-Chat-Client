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
import Input from "@/app/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import useRefinement, {
  RefinementCallback,
} from "@/../lib/hooks/useRefinement";
import { verifyUsername, verifyEmail } from "@/../lib/api/auth";
import Image from "next/image";
import FormData from "form-data";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import toast from "react-hot-toast";
import { ChangePasswordForm } from "@/app/components/Form/ChangePasswordForm";

interface pageProps {}

export default function Profile(props: pageProps) {
  const { data: session, update } = useSession();

  const user = session?.user;

  const axiosAuth = useAxiosAuth();

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const checkNameToBeUnique = (): RefinementCallback<UpdateUserDataType> => {
    return async (data) => {
      return await verifyUsername(
        data.username as string,
        user?.username as string
      );
    };
  };

  const checkEmailToBeUnique = (): RefinementCallback<UpdateUserDataType> => {
    return async (data) => {
      return await verifyEmail(data.email as string, user?.email as string);
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
      avatar_url: {},
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

  const watchAvatar = watch("avatar_url");

  const uploadAvatar = async (avatar: any) => {
    if (!avatar) {
      return user?.avatar_url;
    }

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

    return uploadResult.secure_url;
  };

  const onSubmit: SubmitHandler<UpdateUserDataType> = async (data) => {
    setIsLoading(true);

    console.log("data: ", data);

    try {
      // Make a request to the server to update the user's profile
      const avatar = data.avatar_url[0];

      console.log("avatar: ", avatar);

      const uploadResult = await uploadAvatar(avatar);

      // Update the user's profile

      const updateUserResponse = await axiosAuth.put(`/user/update`, {
        ...data,
        avatar_url: uploadResult,
      });

      console.log("updateUserResponse: ", updateUserResponse);

      // Update the session
      await update(updateUserResponse.data);

      toast.success("Profile updated successfully");
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
      avatar_url: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username, user?.first_name, user?.last_name, user?.email]);

  console.log("watchAvatar: ", watchAvatar);
  console.log("errors: ", errors);

  return (
    <>
      <div className="flex h-screen flex-col gap-4 p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="flex w-1/4 flex-col">
            <h3>Personal Information</h3>
            <p className="text-xs text-gray-400">
              Use a permanent address where you can receive email.
            </p>
          </div>
          <div className="w-3/4 p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center gap-2">
                <Image
                  src={
                    watchAvatar &&
                    watchAvatar.length > 0 &&
                    watchAvatar[0] instanceof File
                      ? URL.createObjectURL(watchAvatar[0])
                      : user?.avatar_url
                      ? user?.avatar_url
                      : "/avatar-cute-2.jpeg"
                  }
                  alt="avatar"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full"
                />
                <input
                  {...register("avatar_url")}
                  type="file"
                  accept="image/*"
                  className="
                  rounded border border-gray-300 p-2 text-sm  text-gray-900 focus:border-gray-300        
                  focus:outline-none
                  focus:ring-0
                "
                />
              </div>
              {errors.avatar_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.avatar_url?.message as any}
                </p>
              )}
              <Input
                id="username"
                label="Username"
                disabled={!!isLoading}
                control={control}
                onChange={() => {
                  uniqueName.invalidate();
                }}
                errors={errors}
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
                    disabled={!!isLoading}
                    control={control}
                    errors={errors}
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
                    disabled={!!isLoading}
                    errors={errors}
                    control={control}
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
                disabled={!!isLoading}
                control={control}
                onChange={() => {
                  uniqueEmail.invalidate();
                }}
                errors={errors}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email?.message}
                </p>
              )}
              <div className="my-4 flex items-center justify-start space-x-4">
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
                <Button
                  color="success"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isLoading as boolean}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex w-1/4 flex-col">
            <h3>Change Password</h3>
            <p className="text-xs text-gray-400">
              Update your password associated with your account.
            </p>
          </div>
          <div className="w-3/4 p-4">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
