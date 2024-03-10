import Link from "next/link";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export default function ResetPasswordSuccess() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <IoCheckmarkCircleOutline className="text-6xl text-green-500" />

        <h2 className="text-2xl font-bold tracking-wide text-gray-800">
          Password Reset
        </h2>
        <h4 className="mt-2 text-sm tracking-wide text-gray-600">
          Your password has been successfully reset.
        </h4>

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
