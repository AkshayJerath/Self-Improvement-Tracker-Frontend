'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBehaviors } from '@/hooks/useBehaviors';

export default function BehaviorCard({ behavior }) {
  const router = useRouter();
  const { deleteBehavior } = useBehaviors();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const calculateCompletionPercentage = () => {
    if (!behavior.todos || behavior.todos.length === 0) return 0;
    
    const completedTodos = behavior.todos.filter(todo => todo.completed).length;
    return Math.round((completedTodos / behavior.todos.length) * 100);
  };

  const handleDelete = async () => {
    if (showConfirmation) {
      try {
        setIsDeleting(true);
        await deleteBehavior(behavior._id);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete behavior:', error);
      } finally {
        setIsDeleting(false);
        setShowConfirmation(false);
      }
    } else {
      setShowConfirmation(true);
    }
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="card hover:transform hover:scale-102 transition-all duration-200" style={{ borderLeft: `4px solid ${behavior.color || '#0ea5e9'}` }}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {behavior.title}
        </h3>
        
        <div className="flex space-x-2">
          <Link
            href={`/behaviors/${behavior._id}`}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </Link>
          
          <button
            onClick={handleDelete}
            className={`text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isDeleting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
        <div
          className="bg-primary-600 h-2.5 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>
            {behavior.todos?.length || 0} {behavior.todos?.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        <div className="text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {completionPercentage}% complete
          </span>
        </div>
      </div>

      {/* View button */}
      <div className="mt-4">
        <Link
          href={`/behaviors/${behavior._id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600"
        >
          View Details
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </Link>
      </div>

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-xl p-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs w-full">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Delete Behavior?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This will also delete all todo items associated with this behavior. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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