import React, { Suspense } from 'react';
import { Message as MessageType } from '../store/chatStore';
import ReactMarkdown from 'react-markdown';
// Lazy load ChartDisplay and CodeBlock
const ChartDisplay = React.lazy(() => import('./ChartDisplay'));
const CodeBlock = React.lazy(() => import('./CodeBlock'));

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`prose dark:prose-invert max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white prose-strong:text-white prose-a:text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        {message.text && (
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code(props: any) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { node, inline, className, children, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <Suspense fallback={<code className={className} {...rest}>{children}</code>}>
                      <CodeBlock
                        language={match[1]}
                        {...rest}
                      >
                        {children}
                      </CodeBlock>
                    </Suspense>
                  ) : (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.text}
            </ReactMarkdown>
        )}
        
        {message.chartData && (
          <Suspense fallback={<div className="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">Loading Chart...</div>}>
            <ChartDisplay chartData={message.chartData} />
          </Suspense>
        )}

        <div className="text-xs text-right mt-2 opacity-75">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Message;
