"use client";

import { SessionProvider } from "next-auth/react";

type nextAuthProviderProps = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: nextAuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
