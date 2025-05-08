'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useBehaviors } from '@/hooks/useBehaviors';
import BehaviorForm from '@/components/behaviors/BehaviorForm';
import TodoList from '@/components/todos/TodoList';

export default function BehaviorDetailPage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const { getBehavior, currentBehavior, loading: behaviorLoading, updateBehavior } = useBehaviors();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = params;
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && id) {
      getBehavior(id);
    }
  }, [user, authLoading, id]);
  
  const handleEditSuccess = () => {
    setIsEditing(false);
    getBehavior(id);
  };
  
  const loading = authLoading || behaviorLoading;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) return null; // Redirect handled in useEffect
  
  if (!currentBehavior) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Behavior not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The behavior you're looking for might have been deleted or doesn't exist.
        </p>
        <Link href="/behaviors" className="btn-primary">
          Back to Behaviors
        </Link>
      </div>
    );
  }
  
  const completedTodos = currentBehavior.todos?.filter(todo => todo.completed)?.length || 0;
  const totalTodos = currentBehavior.todos?.length || 0;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Link
            href="/behaviors"
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </Link>
          {isEditing ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Behavior
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentBehavior.title}
            </h1>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 md:mt-0 btn-secondary"
          >
            Edit Behavior
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="card mb-6">
          <BehaviorForm
            behavior={currentBehavior}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="card mb-6 p-6" style={{ borderLeft: `4px solid ${currentBehavior.color || '#0ea5e9'}` }}>
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {completedTodos} of {totalTodos} items completed
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                completion rate
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
              className="h-4 rounded-full"
              style={{ 
                width: `${completionPercentage}%`,
                backgroundColor: currentBehavior.color || '#0ea5e9' 
              }}
            ></div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Todo Items
      </h2>
      
      <TodoList behaviorId={id} behaviorColor={currentBehavior.color} />
    </div>
  );
}