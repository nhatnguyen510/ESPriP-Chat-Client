import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut, useSession } from "next-auth/react";
import useAxiosAuth from "./useAxiosAuth";
import { CurrentUserReturnType } from "../session";

const useRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const logout = useCallback(async () => {
    const res = await axiosAuth.post(`auth/logout`);

    const logoutResponse = await signOut({
      redirect: false,
      callbackUrl: "/login",
    });
    router.push(logoutResponse?.url as string);
  }, [axiosAuth, router]);

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chat",
        icon: HiChat,
        active: pathname === "/chat",
      },
      {
        label: "Friends",
        href: "/friends",
        icon: HiUsers,
        active: pathname === "/friends",
      },
      {
        label: "Logout",
        onClick: () => logout(),
        href: "#",
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, logout]
  );

  return routes;
};

export default useRoutes;
