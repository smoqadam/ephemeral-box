"use client";

import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-emerald-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="text-white text-3xl font-bold">E</div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 via-emerald-600 to-orange-600 bg-clip-text text-transparent">
            Ephemeral OS
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A beautiful, ephemeral workspace for your temporary tasks and notes.
            <br />
            Everything lives in memory - nothing persists unless you export it.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 transition-all duration-300 shadow-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-lg">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Notes</h3>
            <p className="text-gray-600 text-sm">
              Jot down thoughts, ideas, and temporary notes with our elegant notepad.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 transition-all duration-300 shadow-lg">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-emerald-600 text-lg">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Task Management</h3>
            <p className="text-gray-600 text-sm">
              Organize your tasks and todos with a clean, distraction-free interface.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-gray-500 text-sm">
          Click on an app in the dock below to get started
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
