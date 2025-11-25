import React, { useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChatStore } from '../store/chatStore';
import { getHistoryFromN8n } from '../services/n8nApiService';

const ChatInterface = () => {
  const { sessionId, setMessages } = useChatStore();

  useEffect(() => {
    const loadHistory = async () => {
      if (sessionId) {
        const historyMessages = await getHistoryFromN8n(sessionId);
        setMessages(historyMessages);
      }
    };

    if (import.meta.env.VITE_SHOW_SAMPLE_CHAT !== 'true') {
      loadHistory();
    }
  }, [sessionId, setMessages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <header className="p-4 border-b dark:border-gray-700 text-center">
        <h1 className="text-xl font-bold">n8n Chat</h1>
      </header>
      <MessageList />
      <div className="p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatInterface;
