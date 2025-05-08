'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthForm({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-md rounded-xl sm:px-10">
      {mode === 'login' ? (
        <>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <button
                onClick={toggleMode}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <RegisterForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Log in
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}