"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

interface RemoveFriendModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
  handleRemoveFriend: () => void;
}

export const RemoveFriendModal: React.FC<RemoveFriendModalProps> = ({
  username,
  isOpen,
  onClose,
  handleRemoveFriend,
}) => {
  return (
    <>
      <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h4>
              Are you sure you want to remove{" "}
              <span className="text-primary-500">{username}</span> as a friend?
            </h4>
          </ModalHeader>
          <ModalBody>
            <p>You will no longer be able to see their chat with them.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => {
                onClose();
                handleRemoveFriend();
              }}
            >
              Remove Friend
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
