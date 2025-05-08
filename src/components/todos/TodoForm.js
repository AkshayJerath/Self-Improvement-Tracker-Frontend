'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';

export default function TodoForm({ behaviorId, behaviorColor }) {
  const { addTodo } = useTodos();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Todo text is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      await addTodo(behaviorId, { text });
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Add a new item..."
          className="input pl-4 pr-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
          maxLength={200}
          style={{ borderLeft: `4px solid ${behaviorColor || '#0ea5e9'}` }}
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1 text-sm font-medium rounded-md text-white"
          style={{ backgroundColor: behaviorColor || '#0ea5e9' }}
          disabled={isSubmitting || !text.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {200 - text.length} characters remaining
      </p>
    </form>
  );
}