"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../components/RegisterInput";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormData } from "@/../lib/validation/registerSchema";
import { signIn } from "next-auth/react";

export default function Login() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log({ data });
    setIsLoading(true);

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: "/chat",
    });

    console.log({ res });

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

  const handleDisplayPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Sign In
      </h2>

      <div className="my-8 text-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="username"
            label="Username"
            disabled={!!isLoading}
            control={control}
            trigger={trigger}
            errors={errors}
            required={true}
          />

          <Input
            id="password"
            label="Password"
            type={`${showPassword ? "text" : "password"}`}
            disabled={!!isLoading}
            control={control}
            errors={errors}
            required={true}
            handleDisplayPassword={handleDisplayPassword}
          />

          {errors.root?.serverError && (
            <h3 className="mt-2 text-sm text-red-500">
              {errors?.root?.serverError.message}
            </h3>
          )}

          <div className="mb-4 mt-6 flex items-center justify-center space-x-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-8 py-2 uppercase text-gray-100 transition duration-150 hover:bg-blue-700 hover:shadow-xl"
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? <LoadingSpinner /> : "Sign In"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 border-t-[1px] border-slate-300">
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 hover:underline"
            title="Sign In"
          >
            Sign up here!
          </Link>
        </p>
      </div>
    </>
  );
}
