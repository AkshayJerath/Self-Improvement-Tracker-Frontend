'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    try {
      setIsSubmitting(true);
      await axios.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Password updated successfully');
    } catch (error) {
      if (error.response?.data?.error === 'Current password is incorrect') {
        setErrors({
          currentPassword: 'Current password is incorrect'
        });
      } else {
        setErrors({
          submit: error.response?.data?.error || 'Failed to update password'
        });
      }
      toast.error('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThemeUpdate = async (newTheme) => {
    try {
      await axios.put('/auth/preferences', { theme: newTheme });
      toggleTheme();
    } catch (error) {
      console.error('Failed to update theme preference:', error);
      toast.error('Failed to update theme');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (authLoading) {
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

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>
      
      <div className="space-y-8">
        {/* Theme settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Appearance
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Choose your preferred theme:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => theme === 'dark' && handleThemeUpdate('light')}
                className={`p-4 border rounded-lg ${
                  theme === 'light'
                    ? 'border-primary-500 ring-2 ring-primary-500 bg-white'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } dark:border-gray-600 dark:hover:bg-gray-700`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Light Mode</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Use light theme</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => theme === 'light' && handleThemeUpdate('dark')}
                className={`p-4 border rounded-lg ${
                  theme === 'dark'
                    ? 'border-primary-500 ring-2 ring-primary-500 dark:bg-gray-800'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } dark:border-gray-600 dark:hover:bg-gray-700`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-gray-400 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Password settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Change Password
          </h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300" role="alert">
                {errors.submit}
              </div>
            )}
            
            <div>
              <label htmlFor="currentPassword" className="label">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`input pr-10 ${errors.currentPassword ? 'border-red-500 dark:border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05,0,0,1,12,19c-4.478,0-8.268-2.943-9.543-7A9.97,9.97,0,0,1,4.02,8.971m5.858,5.858a3,3,0,1,0,4.243-4.243m0,0,5.657-5.657C18.785,5.842,17.693,6.5,16.485,6.85A9.953,9.953,0,0,1,12,5C7.522,5,3.732,7.943,2.458,12A9.951,9.951,0,0,1,6.942,17.485m8.302-.232,2.897-2.896"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.currentPassword}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="label">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`input pr-10 ${errors.newPassword ? 'border-red-500 dark:border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05,0,0,1,12,19c-4.478,0-8.268-2.943-9.543-7A9.97,9.97,0,0,1,4.02,8.971m5.858,5.858a3,3,0,1,0,4.243-4.243m0,0,5.657-5.657C18.785,5.842,17.693,6.5,16.485,6.85A9.953,9.953,0,0,1,12,5C7.522,5,3.732,7.943,2.458,12A9.951,9.951,0,0,1,6.942,17.485m8.302-.232,2.897-2.896"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.newPassword}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`input ${errors.confirmPassword ? 'border-red-500 dark:border-red-400' : ''}`}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Account settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Account
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/profile')}
                className="w-full text-left px-4 py-3 flex justify-between items-center border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Profile Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your personal information
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={handleLogout}
                  className="btn-danger w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}