import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    [key: string]: any; // Allow other properties like colors
  }[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  chartData?: ChartData;
}

interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  sessionId: string;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  setLoading: (isLoading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      input: '',
      isLoading: false,
      sessionId: `session_${Date.now()}`,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      setInput: (input) => set({ input }),
      setLoading: (isLoading) => set({ isLoading }),
      clearChat: () => {
        // When clearing chat, we start a new session
        set({ messages: [], sessionId: `session_${Date.now()}` });
      },
    }),
    {
      name: 'chat-session', // name of the item in the storage (must be unique)
      partialize: (state) => ({ sessionId: state.sessionId }), // only persist the 'sessionId' part of the state
    }
  )
);
