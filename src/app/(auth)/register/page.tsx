"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/app/components/RegisterInput";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import schema, { FormData } from "@/../lib/validation/registerSchema";
import { toast } from "react-toastify";
import useRefinement, {
  RefinementCallback,
} from "@/../lib/hooks/useRefinement";
import { register, verifyUsername, verifyEmail } from "@/../lib/api/auth";

export default function Register() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [showConfirmedPassword, setShowConfirmedPassword] =
    useState<Boolean>(false);

  const checkNameToBeUnique = (): RefinementCallback<FormData> => {
    return async (data) => {
      return await verifyUsername(data.username);
    };
  };

  const checkEmailToBeUnique = (): RefinementCallback<FormData> => {
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
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      confirmed_password: "",
      // photo_url: "",
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
    mode: "all",
    // criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      const response = await toast.promise(
        register(data),
        {
          pending: "Registering...",
          success: "Registered successfully 🎉",
          error: "Something went wrong 😢",
        },
        {
          position: "top-center",
          hideProgressBar: true,
        }
      );

      console.log("response: ", response);

      router.push("/login");
    } catch (err) {
      console.log("err: ", err);
    }

    setIsLoading(false);
  };

  const handleDisplayPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDisplayConfirmedPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Sign Up
      </h2>

      <div className="my-8 text-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="username"
            label="Username"
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
            disabled={!!isLoading}
            control={control}
            onChange={() => {
              uniqueEmail.invalidate();
            }}
            errors={errors}
            required={true}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          )}
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password?.message}
            </p>
          )}
          <Input
            id="confirmed_password"
            label="Password Confirmation"
            type={`${showConfirmedPassword ? "text" : "password"}`}
            disabled={!!isLoading}
            control={control}
            errors={errors}
            required={true}
            handleDisplayConfirmedPassword={handleDisplayConfirmedPassword}
          />
          {errors.confirmed_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmed_password?.message}
            </p>
          )}

          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="remember_me"
              id="remember_me"
              className="mr-2 rounded focus:ring-0"
            />
            <label htmlFor="remember_me" className="text-gray-700">
              I accept the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                privacy policy
              </a>
            </label>
          </div>

          <div className="my-4 flex items-center justify-end space-x-4">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-8 py-2 uppercase text-gray-100 duration-150 transition hover:bg-blue-700 hover:shadow-xl"
              onClick={handleSubmit(onSubmit)}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 border-t-[1px] border-slate-300">
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 hover:underline"
            title="Sign In"
          >
            Sign in here!
          </Link>
        </p>
      </div>
    </>
  );
}
