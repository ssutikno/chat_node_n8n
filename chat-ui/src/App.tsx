import { useState } from 'react';
import ChatInterface from './components/ChatInterface';

type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={theme}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
        <div className="fixed top-4 right-4 z-10">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium"
          >
            Toggle Theme
          </button>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;
