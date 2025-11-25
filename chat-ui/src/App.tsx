import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={theme}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans flex">
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="fixed top-4 right-4 z-10">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium"
            >
              Toggle Theme
            </button>
          </div>
          <ChatInterface toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </main>
      </div>
    </div>
  );
}

export default App;
