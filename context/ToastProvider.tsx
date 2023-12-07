"use client";

import { Slide, ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster />
      {children}
      {/* <ToastContainer transition={Slide} /> */}
    </>
  );
}
