

const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
        <div className="flex items-center space-x-1">
          <span className="text-gray-500 dark:text-gray-400">Typing</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
