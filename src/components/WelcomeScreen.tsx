"use client";

import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50/50">
      <div className="text-center max-w-3xl px-8">
        <div className="mb-16">
          <div className="w-16 h-16 mx-auto mb-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-wide">
            Ephemeral
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            A clean workspace for temporary tasks and notes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="text-left p-6">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Notes</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Simple note-taking with automatic saving.
            </p>
          </div>
          
          <div className="text-left p-6">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Tasks</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Manage your daily tasks and todos.
            </p>
          </div>
        </div>
        
        <div className="text-slate-400 text-sm">
          Select an app from the sidebar
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
