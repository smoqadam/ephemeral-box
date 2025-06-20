"use client";

import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (!inputValue.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      
      <ul className="overflow-auto flex-1">
        {todos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            No tasks yet. Add one above!
          </p>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-2"
              />
              <span 
                className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoApp;
