"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useExport } from "@/contexts/ExportContext";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { registerApp, unregisterApp } = useExport();

  useEffect(() => {
    // Load from localStorage
    const savedTodos = localStorage.getItem("todo-list");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever todos change
    localStorage.setItem("todo-list", JSON.stringify(todos));
  }, [todos]);

  const exportData = useMemo(() => () => ({
    todos,
    totalTodos: todos.length,
    completedTodos: todos.filter(todo => todo.completed).length,
    lastModified: new Date().toISOString()
  }), [todos]);

  useEffect(() => {
    registerApp("todo", exportData);
    
    return () => {
      unregisterApp("todo");
    };
  }, [exportData, registerApp, unregisterApp]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const exportTodos = () => {
    const data = {
      todos,
      totalTodos: todos.length,
      completedTodos: todos.filter(todo => todo.completed).length,
      lastModified: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `todos-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-slate-900">Tasks</h1>
        </div>

        {/* Add Todo */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900 placeholder-slate-400 transition-colors"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={clearCompleted}
              className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              Clear Completed
            </button>
            <button
              onClick={exportTodos}
              className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              Export
            </button>
          </div>
          <div className="text-sm text-slate-500">
            {todos.filter(todo => !todo.completed).length} of {todos.length} remaining
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="font-medium text-slate-600 mb-1">No tasks yet</p>
              <p className="text-sm text-slate-500">Add your first task above</p>
            </div>
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`group bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors ${todo.completed ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                    todo.completed 
                      ? 'bg-slate-800 border-slate-800 text-white' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 transition-colors ${
                  todo.completed 
                    ? "line-through text-slate-400" 
                    : "text-slate-900"
                }`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoApp;
