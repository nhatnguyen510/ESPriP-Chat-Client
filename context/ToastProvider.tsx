"use client";

import { Slide, ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer transition={Slide} />
    </>
  );
}
