"use client";

import Input from "@/app/components/Input";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgotPassword } from "@/../lib/api/auth";
import Link from "next/link";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type ForgotPasswordDataType = {
  email: string;
};

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    defaultValues: {
      email: "",
    },
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<ForgotPasswordDataType> = async (data) => {
    setIsLoading(true);

    try {
      const { message } = await forgotPassword(data.email);
      router.push(`/forgot-password/success?email=${data.email}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Forgot Password
      </h2>

      <h4 className="mt-2 text-center text-sm tracking-wide text-gray-600">
        Enter your email address and we will send you a link to reset your
        password.
      </h4>

      <div className="my-8 text-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            label="Email"
            disabled={!!isLoading}
            control={control}
            errors={errors}
            required={true}
          />

          <div className="mt-6">
            <Button
              type="submit"
              color="primary"
              variant="shadow"
              radius="sm"
              isLoading={isLoading}
              fullWidth
            >
              Send Email
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-blue-500 hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
