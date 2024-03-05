import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";

const useRoutes = () => {
  const pathname = usePathname();

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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return routes;
};

export default useRoutes;
