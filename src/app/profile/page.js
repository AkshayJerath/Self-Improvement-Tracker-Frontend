'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [stats, setStats] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      fetchUserStats();
    }
  }, [user, authLoading]);

  const fetchUserStats = async () => {
    try {
      const res = await axios.get('/stats');
      setStats(res.data.data.summary);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      const res = await axios.put('/auth/updatedetails', {
        name: formData.name,
        email: formData.email
      });
      
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors({
          submit: error.response.data.error
        });
      } else {
        setErrors({
          submit: 'Failed to update profile'
        });
      }
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
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
        Your Profile
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile information */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Account Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300" role="alert">
                  {errors.submit}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-500 dark:border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Security
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Want to change your password?
              </p>
              <button
                onClick={() => router.push('/settings')}
                className="btn-secondary"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile stats */}
        <div>
          <div className="card bg-gradient-to-br from-primary-50 to-white dark:from-primary-900 dark:to-gray-800">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Activity Summary
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Behaviors
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalBehaviors || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  To do Items
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalTodos || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.completionPercentage || 0}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-2">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full"
                    style={{ width: `${stats?.completionPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.streakDays || 0} days
                </p>
              </div>
            </div>
          </div>
          
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h2>
            
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/behaviors')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Manage Behaviors
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/stats')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  View Statistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/achievements')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Achievements
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}