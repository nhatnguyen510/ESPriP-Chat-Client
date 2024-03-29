"use client";

import React, { useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { signOut } from "next-auth/react";
import { useChatContext } from "@/../context/ChatProvider";
import { deleteKeys } from "@/../lib/api/keys";

interface LogoutModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { sentFriendRequests } = useChatContext();

  const logout = useCallback(async () => {
    const res = await axiosAuth.post(`auth/logout`);

    const logoutResponse = await signOut({
      redirect: false,
      callbackUrl: "/login",
    });

    if (!sentFriendRequests?.length) {
      // Call API for deleting keys
      await deleteKeys(axiosAuth);
    }

    router.push(logoutResponse?.url as string);
  }, [axiosAuth, router, sentFriendRequests]);

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Logout</h4>
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to logout?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    logout();
                    onClose();
                  }}
                >
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
