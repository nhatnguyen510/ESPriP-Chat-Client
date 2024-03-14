"use client";

import Image from "next/image";
import clsx from "clsx";

interface AvatarProps {
  image?: string;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ image, isOnline }) => {
  return (
    <>
      <div className="relative flex w-12 items-center justify-center">
        <div
          className="
        relative 
        inline-block 
        h-9 
        w-9
        overflow-hidden 
        rounded-full 
        md:h-11 
        md:w-11
      "
        >
          <Image fill src={image || "/no-avatar.png"} alt="Avatar" />
        </div>
        <span
          className={clsx(
            `
            absolute
            right-0 
            top-0 
            z-10 
            block 
            h-2 
            w-2 
            rounded-full 
            ring-2 
            ring-white 
            md:h-3 
            md:w-3`,
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
      </div>
    </>
  );
};

export default Avatar;
