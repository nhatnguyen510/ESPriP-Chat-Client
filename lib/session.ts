import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../pages/api/auth/[...nextauth]";

export async function getSession() {
  return await getServerSession(nextAuthOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user;
}

export type CurrentUserReturnType = Awaited<ReturnType<typeof getCurrentUser>>;
