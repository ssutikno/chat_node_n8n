import React, { useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChatStore } from '../store/chatStore';
import { getHistoryFromN8n } from '../services/n8nApiService';

interface ChatInterfaceProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { activeConversationId, setMessages } = useChatStore();

  useEffect(() => {
    const loadHistory = async () => {
      if (activeConversationId) {
        const historyMessages = await getHistoryFromN8n(activeConversationId);
        setMessages(historyMessages);
      }
    };

    if (import.meta.env.VITE_SHOW_SAMPLE_CHAT !== 'true') {
      loadHistory();
    }
  }, [activeConversationId, setMessages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto relative">
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none z-50 text-gray-500 dark:text-gray-400"
          aria-label="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
      <MessageList />
      <div className="p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatInterface;
