import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  avatar?: string;
  timestamp: number;
}

interface ChatStore {
  messages: Message[];
  lastUpdated: number | null;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  isExpired: () => boolean;
  initializeWithWelcome: (welcomeMessage: string) => void;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      lastUpdated: null,

      addMessage: (message) => {
        const state = get();
        const newMessage: Message = {
          ...message,
          id: state.messages.length + 1,
          timestamp: Date.now(),
        };
        set({
          messages: [...state.messages, newMessage],
          lastUpdated: Date.now(),
        });
      },

      clearMessages: () => {
        set({ messages: [], lastUpdated: null });
      },

      isExpired: () => {
        const state = get();
        if (!state.lastUpdated) return true;
        return Date.now() - state.lastUpdated > CACHE_DURATION;
      },

      initializeWithWelcome: (welcomeMessage) => {
        const state = get();
        // Only initialize if empty or expired
        if (state.messages.length === 0 || state.isExpired()) {
          set({
            messages: [
              {
                id: 1,
                text: welcomeMessage,
                sender: "assistant",
                timestamp: Date.now(),
              },
            ],
            lastUpdated: Date.now(),
          });
        }
      },
    }),
    {
      name: "chat-storage", // LocalStorage key
      partialize: (state) => ({
        messages: state.messages,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
