import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  chartData?: ChartData;
}

export interface Conversation {
  id: string;
  title: string;
}

interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  activeConversationId: string | null;
  input: string;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  setLoading: (isLoading: boolean) => void;
  startNewConversation: () => void;
  setActiveConversationId: (id: string) => void;
  setConversationTitle: (id: string, title: string) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
}

const createNewConversation = (): Conversation => ({
  id: `session_${Date.now()}`,
  title: 'New Chat',
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      conversations: [],
      activeConversationId: null,
      input: '',
      isLoading: false,
      addMessage: (message) => {
        set((state) => ({ messages: [...state.messages, message] }));
        // If the new message is the first one, set conversation title
        if (get().messages.length === 1) {
          const newTitle = message.text.substring(0, 40) + (message.text.length > 40 ? '...' : '');
          get().setConversationTitle(get().activeConversationId!, newTitle);
        }
      },
      setMessages: (messages) => set({ messages }),
      setInput: (input) => set({ input }),
      setLoading: (isLoading) => set({ isLoading }),
      startNewConversation: () => {
        const newConversation = createNewConversation();
        set((state) => ({
          messages: [],
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id,
        }));
      },
      setActiveConversationId: (id: string) => {
        set({ activeConversationId: id });
        // When switching, clear current messages before fetching new ones
        set({ messages: [] });
      },
      setConversationTitle: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        }));
      },
      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },
    }),
    {
      name: 'chat-sessions-list',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);

// Initialize the store
const unsub = useChatStore.subscribe((state) => {
  if (!state.activeConversationId && state.conversations.length === 0) {
    state.startNewConversation();
  } else if (!state.activeConversationId && state.conversations.length > 0) {
    state.setActiveConversationId(state.conversations[0].id);
  }
  unsub(); // unsubscribe after first run
});
