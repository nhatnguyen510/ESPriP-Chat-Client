"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CurrentUserReturnType } from "@/../lib/session";
import { AiOutlineSetting } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";

type userSettingsProps = {
  user?: CurrentUserReturnType;
};

const UserSettings: React.FC<userSettingsProps> = ({ user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<Boolean>(false);
  const router = useRouter();
  const axiosAuth = useAxiosAuth(user);

  const onSettingsOpen = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const logout = async () => {
    const res = await axiosAuth.get(`auth/logout/${user?.id}`);

    console.log({ res });

    const logoutResponse = await signOut({
      redirect: false,
      callbackUrl: "/login",
    });
    router.push(logoutResponse?.url as string);
  };

  return (
    <>
      <div className="mt-4 flex w-full items-center justify-between">
        <div className="flex items-center">
          <Image
            quality={100}
            width={0}
            height={0}
            src="/avatar-cute-2.jpeg"
            alt="User Avatar"
            className="mr-2 h-8 w-8 rounded-full"
          />
          <div>
            <p className="font-bold">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div
          className="relative cursor-pointer rounded-full bg-slate-100 p-4 font-bold hover:bg-slate-200"
          onClick={onSettingsOpen}
        >
          <AiOutlineSetting />
          <div
            className={`${
              isSettingsOpen ? "block" : "hidden"
            } absolute right-2 top-[-130px] z-20 mt-2 rounded-md border border-gray-100 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800`}
          >
            <div className="flex w-48 flex-col">
              <a
                href=""
                className="transform px-4 py-2 text-sm capitalize text-gray-700 transition-colors duration-300 hover:bg-slate-100 hover:text-gray-500 dark:text-gray-300"
              >
                My profile
              </a>
              <a
                href=""
                className="transform px-4 py-2 text-sm capitalize text-gray-700 transition-colors duration-300 hover:bg-slate-100 hover:text-gray-500 dark:text-gray-300"
              >
                Edit profile
              </a>
              <hr className="border-gray-200 dark:border-gray-700" />{" "}
              <button
                onClick={logout}
                className="flex transform items-center gap-2 px-4 py-2 text-sm capitalize text-gray-700 transition-colors duration-300 hover:bg-slate-100 hover:text-gray-500 dark:text-gray-300"
              >
                <IoLogOutOutline />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
