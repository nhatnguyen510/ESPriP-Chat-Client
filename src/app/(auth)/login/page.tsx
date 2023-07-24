"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "../../components/Input";
import { signIn } from "next-auth/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: "/chat",
    });

    if (res?.error) {
      setError("root.serverError", {
        message: res.error,
        type: "serverError",
      });
    } else {
      router.push(res?.url as string);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-gray-200">
        <div className="flex w-[400px] flex-col items-center justify-center gap-6">
          <div className="w-full">
            <h3 className="text-center text-4xl">Login</h3>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-12 rounded-lg bg-white p-6 pt-8 shadow-xl">
            <Input
              id="username"
              label="Username"
              disabled={!!isLoading}
              register={register}
              errors={errors}
              required={true}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              disabled={!!isLoading}
              register={register}
              errors={errors}
              required={true}
            />
            {errors.root?.serverError && (
              <h3 className="text-xl text-red-500">
                {errors?.root?.serverError.message}
              </h3>
            )}
            <button
              type="submit"
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-blue-500 font-bold leading-6 text-white"
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? <LoadingSpinner /> : "Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
