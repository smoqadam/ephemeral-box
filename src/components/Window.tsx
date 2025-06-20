"use client";

import React, { useRef } from 'react';
import { AppWindow } from '@/types';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';

interface WindowProps {
  window: AppWindow;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({ window, isActive, onClose, onFocus }) => {
  const { id, title, component: Component, position, size } = window;
  const nodeRef = useRef(null); // Create a ref to pass to Draggable

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag-handle"
      defaultPosition={position}
      onMouseDown={onFocus}
    >
      <div ref={nodeRef} className="absolute">
        <Resizable
          defaultSize={size}
          minHeight={200}
          minWidth={300}
          className={`rounded-lg shadow-xl overflow-hidden transition-shadow duration-200 ${
            isActive ? 'shadow-2xl ring-1 ring-blue-500/20 z-10' : 'z-0'
          }`}
          style={{
            background: isActive ? 'var(--window-bg-active, rgba(255, 255, 255, 0.85))' : 'var(--window-bg, rgba(255, 255, 255, 0.75))',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Window title bar */}
          <div 
            className="window-drag-handle h-10 flex items-center justify-between px-3 bg-gradient-to-r from-gray-100/90 to-white/90 dark:from-gray-800/90 dark:to-gray-700/90 border-b border-gray-200/80 dark:border-gray-700/80"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600 transition-colors duration-150" onClick={onClose}></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 font-medium text-sm text-gray-700 dark:text-gray-300">
              {title}
            </div>
          </div>

          {/* Window content */}
          <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
            <Component />
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default Window;
