import React from 'react';
import { useChatStore } from '../store/chatStore';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const {
    conversations,
    activeConversationId,
    startNewConversation,
    setActiveConversationId,
  } = useChatStore();

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-50 dark:bg-gray-800 z-30 transform transition-transform duration-300 ease-in-out border-r dark:border-gray-700 ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-14 flex items-center justify-between px-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">n8n Chat</h1>
          <button
            onClick={toggle}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Close sidebar"
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
        </div>
        <div className="p-2">
          <button
            onClick={startNewConversation}
            className="w-full px-4 py-2 text-left text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            + New Chat
          </button>
        </div>
        <div className="flex-grow overflow-y-auto px-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`w-full px-4 py-2 my-1 text-left text-sm rounded-md truncate ${
                conv.id === activeConversationId
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
