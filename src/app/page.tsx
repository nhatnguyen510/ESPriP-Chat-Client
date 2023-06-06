"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default async function Page() {
  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full items-center justify-center">
        <h1>Hello Nhat</h1>
      </div>
    </div>
  );
}
