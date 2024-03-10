"use client";

import Link from "next/link";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Button } from "@nextui-org/react";
import { forgotPassword } from "@/../lib/api/auth";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordSuccess() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  const handleResendEmail = async () => {
    setIsLoading(true);

    try {
      const { message } = await forgotPassword(email as string);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-wide text-gray-800">
          Email Sent
        </h2>
        <IoCheckmarkCircleOutline className="text-6xl text-green-500" />

        <h4 className="mt-2 text-sm tracking-wide text-gray-600">
          We have sent you an email with a link to reset your password.
        </h4>

        <h4 className="mt-2 text-sm tracking-wide text-gray-600">
          If you don't see the email, please check other places it might be,
          like your junk, spam, social, or other folders.
        </h4>

        <h4 className="mt-2 text-sm tracking-wide text-gray-600">
          If you still can't find the email, click below to resend it.
        </h4>

        <Button
          isLoading={isLoading}
          color="primary"
          variant="shadow"
          fullWidth
          className="mt-2"
          onPress={handleResendEmail}
        >
          Resend Email
        </Button>

        <Link
          href="/login"
          className="mt-2 text-sm text-gray-600 hover:text-blue-500 hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
