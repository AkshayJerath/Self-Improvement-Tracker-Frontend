'use client';

import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { useTodos } from '@/hooks/useTodos';

export default function TodoList({ behaviorId, behaviorColor }) {
  const { todos, getTodos, loading } = useTodos();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (behaviorId) {
      getTodos(behaviorId);
    }
  }, [behaviorId]);

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return true;
    })
    .filter(todo => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  return (
    <div>
      <TodoForm behaviorId={behaviorId} behaviorColor={behaviorColor} />

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'all'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'active'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Active ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'completed'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-4 h-4 text-gray-500 dark:text-gray-400" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 20 20"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="input pl-10"
            placeholder="Search todos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
        <div
          className="bg-primary-600 h-2.5 rounded-full"
          style={{ 
            width: `${completionPercentage}%`,
            backgroundColor: behaviorColor || '#0ea5e9' 
          }}
        ></div>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading todos...</p>
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              behaviorColor={behaviorColor}
            />
          ))}
        </div>
      ) : todos.length > 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            {filter !== 'all'
              ? `No ${filter} todos found${searchTerm ? ' matching your search' : ''}.`
              : 'No todos found matching your search.'}
          </p>
        </div>
      ) : (
        <div className="text-center py-10 space-y-3">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">No todos yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}