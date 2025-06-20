import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 text-gray-500 dark:text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-700 dark:text-gray-300 mb-3">
          Welcome to OS Ephemeral
        </h1>
        <p className="text-sm max-w-md text-gray-400 dark:text-gray-500">
          A lightweight, modern operating system interface. Select an app from the dock below to begin.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
