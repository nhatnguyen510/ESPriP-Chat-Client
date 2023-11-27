import { create } from "zustand";

interface SessionExpiredModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSessionExpiredModalStore = create<SessionExpiredModalStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
