"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ChangePasswordDataType,
  schema,
} from "@/../lib/validation/changePasswordSchema";
import Input from "../Input";
import { Button } from "@nextui-org/react";
import { changePassword } from "@/../lib/api/auth";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { deriveMasterKey } from "../../../../lib/api/keys";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface ChangePasswordFormProps {}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting: isLoading },
  } = useForm<ChangePasswordDataType>({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirmed_new_password: "",
    },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const axiosAuth = useAxiosAuth();

  const { data: session, update } = useSession();

  const onSubmit: SubmitHandler<ChangePasswordDataType> = async (data) => {
    try {
      const updatedUser = await changePassword(axiosAuth, data);

      await update({
        ...updatedUser,
        master_key: deriveMasterKey(data.new_password),
      });

      toast.success("Password changed successfully!");
    } catch (err) {
      console.log(err);

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="old_password"
        label="Old Password"
        type="password"
        control={control}
        errors={errors}
      />
      {errors.old_password && (
        <p className="mt-1 text-sm text-red-500">
          {errors.old_password?.message}
        </p>
      )}
      <Input
        id="new_password"
        label="New Password"
        type="password"
        control={control}
        errors={errors}
      />
      {errors.new_password && (
        <p className="mt-1 text-sm text-red-500">
          {errors.new_password?.message}
        </p>
      )}
      <Input
        id="confirmed_new_password"
        label="Confirm New Password"
        type="password"
        control={control}
        errors={errors}
      />
      {errors.confirmed_new_password && (
        <p className="mt-1 text-sm text-red-500">
          {errors.confirmed_new_password?.message}
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
          type="submit"
          color="success"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
        >
          Change Password
        </Button>
      </div>
    </form>
  );
};
