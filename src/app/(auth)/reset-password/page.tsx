"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Input from "@/app/components/Input";
import { Button } from "@nextui-org/react";
import { resetPassword } from "@/../lib/api/auth";
import {
  ResetPasswordDataType,
  schema,
} from "@/../lib/validation/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams?.get("email");
  const token = searchParams?.get("token");
  const username = searchParams?.get("username");

  if (!email || !token || !username) {
    router.replace("/forgot-password");
  }

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordDataType>({
    defaultValues: {
      new_password: "",
      confirmed_new_password: "",
    },
    criteriaMode: "all",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ResetPasswordDataType> = async (data) => {
    setIsLoading(true);

    try {
      const { message } = await resetPassword(
        email as string,
        token as string,
        data.new_password
      );
      router.push("/reset-password/success");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
    }

    setIsLoading(false);
  };

  console.log("searchParams: ", searchParams);

  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Reset Password
      </h2>

      <h4 className="mt-2 text-center text-sm tracking-wide text-gray-600">
        Enter your new password for{" "}
        <p className="text-lg font-bold text-gray-800">{username}</p>
      </h4>

      <div className="my-8 text-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="new_password"
            label="New Password"
            type="password"
            disabled={!!isLoading}
            control={control}
            errors={errors}
            required={true}
          />

          {errors.new_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.new_password?.message}
            </p>
          )}

          <Input
            id="confirmed_new_password"
            label="Confirmed Password"
            type="password"
            disabled={!!isLoading}
            control={control}
            errors={errors}
            required={true}
          />

          {errors.confirmed_new_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmed_new_password?.message}
            </p>
          )}

          <div className="mt-6">
            <Button
              type="submit"
              disabled={!!isLoading}
              isLoading={isLoading}
              fullWidth
              variant="shadow"
              color="primary"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
