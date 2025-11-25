import React from 'react';
import { useChatStore } from '../store/chatStore';
import { sendMessageToN8n } from '../services/n8nApiService';

const ChatInput = () => {
  const { input, setInput, addMessage, isLoading } = useChatStore();

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      text: input,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
    };
    
    addMessage(userMessage);
    const messageToSend = input;
    setInput('');

    await sendMessageToN8n(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full p-2 pr-20 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isLoading || input.trim() === ''}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
