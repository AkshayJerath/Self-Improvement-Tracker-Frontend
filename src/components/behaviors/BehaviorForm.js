'use client';

import { useState, useEffect } from 'react';
import { useBehaviors } from '@/hooks/useBehaviors';

export default function BehaviorForm({ behavior, onSuccess, onCancel }) {
  const { createBehavior, updateBehavior } = useBehaviors();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#DC3545');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    { value: '#DC3545', name: 'Red' },
    { value: '#FD7E14', name: 'Orange' },
    { value: '#FFC107', name: 'Yellow' },
    { value: '#28A745', name: 'Green' },
    { value: '#17A2B8', name: 'Teal' },
    { value: '#0D6EFD', name: 'Blue' },
    { value: '#6F42C1', name: 'Purple' },
    { value: '#E83E8C', name: 'Pink' },
  ];

  useEffect(() => {
    if (behavior) {
      setTitle(behavior.title);
      setColor(behavior.color || '#DC3545');
    }
  }, [behavior]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      if (behavior) {
        await updateBehavior(behavior._id, { title, color });
      } else {
        await createBehavior({ title, color });
      }
      setTitle('');
      setColor('#DC3545');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="label">
          Behavior Title
        </label>
        <input
          type="text"
          id="title"
          className="input"
          placeholder="e.g., Health and Hygiene"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          maxLength={50}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {50 - title.length} characters remaining
        </p>
      </div>

      <div>
        <label className="label">Color</label>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <div key={c.value} className="flex items-center">
              <input
                type="radio"
                id={`color-${c.value}`}
                name="color"
                className="hidden"
                value={c.value}
                checked={color === c.value}
                onChange={() => setColor(c.value)}
                disabled={isSubmitting}
              />
              <label
                htmlFor={`color-${c.value}`}
                className={`w-full p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all ${
                  color === c.value
                    ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800'
                    : ''
                }`}
                style={{ backgroundColor: c.value }}
              >
                <span className="sr-only">{c.name}</span>
                {color === c.value && (
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
              </label>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? behavior
              ? 'Updating...'
              : 'Creating...'
            : behavior
            ? 'Update Behavior'
            : 'Create Behavior'}
        </button>
      </div>
    </form>
  );
}