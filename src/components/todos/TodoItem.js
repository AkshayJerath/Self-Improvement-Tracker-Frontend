'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';

export default function TodoItem({ todo, behaviorColor }) {
  const { toggleTodo, updateTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async () => {
    try {
      setIsSubmitting(true);
      await toggleTodo(todo._id);
    } catch (error) {
      console.error('Error toggling to do:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      if (editText.trim() === '') {
        setEditText(todo.text);
        setIsEditing(false);
        return;
      }

      if (editText !== todo.text) {
        try {
          setIsSubmitting(true);
          await updateTodo(todo._id, { text: editText });
        } catch (error) {
          console.error('Error updating to do:', error);
          setEditText(todo.text);
        } finally {
          setIsSubmitting(false);
        }
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (showConfirmation) {
      try {
        setIsDeleting(true);
        await deleteTodo(todo._id);
      } catch (error) {
        console.error('Error deleting to do:', error);
      } finally {
        setIsDeleting(false);
        setShowConfirmation(false);
      }
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`relative group p-4 border-b border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <button
            onClick={handleToggle}
            disabled={isSubmitting || isEditing}
            className={`w-5 h-5 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              borderColor: behaviorColor || '#0ea5e9',
              backgroundColor: todo.completed ? behaviorColor || '#0ea5e9' : 'transparent',
            }}
          >
            {todo.completed && (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
          </button>
        </div>

        <div className="flex-grow min-w-0">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="2"
              autoFocus
              maxLength={200}
            />
          ) : (
            <p
              className={`text-sm text-gray-900 dark:text-white break-words ${
                todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
              }`}
            >
              {todo.text}
            </p>
          )}

          {isEditing && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {200 - editText.length} characters remaining
            </div>
          )}
        </div>

        <div className={`flex-shrink-0 flex space-x-2 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
                title="Cancel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                onClick={handleEdit}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                title="Save"
                disabled={isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
                disabled={isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 z-10">
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}