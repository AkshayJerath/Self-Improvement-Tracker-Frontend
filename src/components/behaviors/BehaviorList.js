'use client';

import { useState, useEffect } from 'react';
import BehaviorCard from './BehaviorCard';
import BehaviorForm from './BehaviorForm';
import { useBehaviors } from '@/hooks/useBehaviors';

export default function BehaviorList() {
  const { behaviors, getBehaviors, loading } = useBehaviors();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getBehaviors();
  }, []);

  const filteredBehaviors = behaviors.filter(behavior =>
    behavior.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSuccess = () => {
    setShowForm(false);
    getBehaviors();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Behaviors
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
              placeholder="Search behaviors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary w-full sm:w-auto"
          >
            {showForm ? 'Cancel' : 'Add Behavior'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {showForm ? 'Create New Behavior' : 'Edit Behavior'}
          </h2>
          <BehaviorForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading behaviors...</p>
        </div>
      ) : filteredBehaviors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBehaviors.map((behavior) => (
            <BehaviorCard key={behavior._id} behavior={behavior} />
          ))}
        </div>
      ) : behaviors.length > 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">No behaviors found matching your search.</p>
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">No behaviors yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Get started by creating your first behavior to track.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create Your First Behavior
          </button>
        </div>
      )}
    </div>
  );
}