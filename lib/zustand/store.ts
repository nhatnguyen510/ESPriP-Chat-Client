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

export const useSessionKeysStore = create<{
  sessionKeys: Record<string, string>;
  setSessionKeys: (
    sessionKeys:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
}>((set) => ({
  sessionKeys: {},
  setSessionKeys: (sessionKeys) => {
    set((state) => ({
      sessionKeys:
        typeof sessionKeys === "function"
          ? sessionKeys(state.sessionKeys)
          : sessionKeys,
    }));
  },
}));
