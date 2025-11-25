import { useEffect, useRef } from 'react';
import { useChatStore, Message as MessageType } from '../store/chatStore';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';

const sampleMessages: MessageType[] = [
  {
    id: 'sample_1',
    sender: 'bot',
    text: 'Hello! Here is a demonstration of what I can display.',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sample_2',
    sender: 'bot',
    text: 'I can render **Markdown** including lists, code, and images:\n\n*   Here is a list item.\n*   And another one.\n\n![A placeholder image](https://placehold.co/600x400/EEE/31343C/png?text=Sample+Image)\n\nAnd here is a code block:\n```javascript\nconsole.log("Hello, World!");\n```',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sample_3',
    sender: 'bot',
    text: 'I can also display complex charts, like this multi-series bar chart:',
    timestamp: new Date().toISOString(),
    chartData: {
      type: 'bar',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Sales',
          data: [120, 198, 150, 240, 189],
          color: '#8884d8',
        },
        {
          label: 'Expenses',
          data: [80, 110, 100, 130, 150],
          color: '#82ca9d',
        },
      ],
    },
  },
  {
    id: 'sample_4',
    sender: 'bot',
    text: 'And here is a line chart showing user engagement over time:',
    timestamp: new Date().toISOString(),
    chartData: {
      type: 'line',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Active Users',
          data: [400, 430, 448, 470],
          color: '#ffc658',
        },
      ],
    },
  },
];


const MessageList = () => {
  const { messages, isLoading, setMessages } = useChatStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load sample data for demonstration if the env variable is set
    if (import.meta.env.VITE_SHOW_SAMPLE_CHAT === 'true') {
      setMessages(sampleMessages);
    }
  }, [setMessages]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Start the conversation by typing a message below.
        </p>
      ) : (
        messages.map((msg) => <Message key={msg.id} message={msg} />)
      )}
      {isLoading && <LoadingIndicator />}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
