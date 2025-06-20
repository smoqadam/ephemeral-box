"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Register export function
    const exportData = () => ({
      todos,
      totalTodos: todos.length,
      completedTodos: todos.filter(todo => todo.completed).length,
      lastModified: new Date().toISOString()
    });
    
    registerApp("todo", exportData);
    
    return () => {
      unregisterApp("todo");
    };
  }, [todos, registerApp, unregisterApp]);

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
    <div className="h-full flex flex-col">
      {/* Header - Add Todo */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              className="w-full px-4 py-3 bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-800 placeholder-gray-400 transition-all duration-200"
              placeholder="What needs to be done? ✨"
            />
          </div>
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            ➕ Add
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={clearCompleted}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-sm rounded-xl transition-all duration-200 font-medium"
            >
              🧹 Clear Completed
            </button>
            <button
              onClick={exportTodos}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              📤 Export
            </button>
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200">
            {todos.filter(todo => !todo.completed).length} remaining
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <p>No todos yet. Add one above to get started!</p>
            </div>
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="group bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded-md border-2 border-gray-300 bg-transparent checked:bg-emerald-500 checked:border-emerald-500 transition-all duration-200"
                  />
                  {todo.completed && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </div>
                <span className={`flex-1 transition-all duration-200 ${
                  todo.completed 
                    ? "line-through text-gray-400" 
                    : "text-gray-800"
                }`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 transition-all duration-200"
                >
                  Delete
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
