import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, ...rest }) => {
  return (
    <SyntaxHighlighter
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={vscDarkPlus as any}
      language={language}
      PreTag="div"
      {...rest}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
