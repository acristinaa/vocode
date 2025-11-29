import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SessionRecord, ExamConfig } from "@/types/index";

interface ExamState {
  // Current exam configuration
  config: ExamConfig | null;
  setConfig: (config: ExamConfig) => void;
  clearConfig: () => void;

  // Session history (persisted)
  sessions: SessionRecord[];
  addSession: (session: SessionRecord) => void;
  clearSessions: () => void;

  // Current session state
  isSessionActive: boolean;
  startSession: () => void;
  endSession: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      // Configuration
      config: null,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: null }),

      // Session history
      sessions: [],
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, 20),
        })),
      clearSessions: () => set({ sessions: [] }),

      // Session state
      isSessionActive: false,
      startSession: () => set({ isSessionActive: true }),
      endSession: () => set({ isSessionActive: false }),
    }),
    {
      name: "vocode-storage",
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);