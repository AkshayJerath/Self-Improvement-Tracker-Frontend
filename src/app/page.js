'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBehaviors } from '@/hooks/useBehaviors';
import axios from '@/lib/axios';
import BehaviorCard from '@/components/behaviors/BehaviorCard';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { getTopBehaviors } = useBehaviors();
  const router = useRouter();
  const [topBehaviors, setTopBehaviors] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [achievementCount, setAchievementCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch top behaviors
      const behaviorsRes = await getTopBehaviors();
      setTopBehaviors(behaviorsRes || []);
      
      // Fetch user statistics
      const statsRes = await axios.get('/stats');
      setStats(statsRes.data.data.summary);
      setRecentActivity(statsRes.data.data.recentActivity || []);
      
      // Fetch achievements count
      const achievementsRes = await axios.get('/achievements');
      setAchievementCount(achievementsRes.data.data.earned || 0);
      
      // Check for new achievements
      await axios.post('/achievements/check');
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Handled by useEffect redirect
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user.name}!
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track your progress and improve yourself one step at a time.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/behaviors" className="btn-primary">
            View All Behaviors
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <h3 className="text-lg font-medium mb-1">Behaviors</h3>
          <p className="text-3xl font-bold">{stats?.totalBehaviors || 0}</p>
          <p className="text-sm mt-2 opacity-80">Total tracked behaviors</p>
        </div>
        
        <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
          <h3 className="text-lg font-medium mb-1">Completion</h3>
          <p className="text-3xl font-bold">{stats?.completionPercentage || 0}%</p>
          <p className="text-sm mt-2 opacity-80">
            {stats?.completedTodos || 0}/{stats?.totalTodos || 0} completed
          </p>
        </div>
        
        <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <h3 className="text-lg font-medium mb-1">Streak</h3>
          <p className="text-3xl font-bold">{stats?.streakDays || 0}</p>
          <p className="text-sm mt-2 opacity-80">Days in a row</p>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <h3 className="text-lg font-medium mb-1">Achievements</h3>
          <p className="text-3xl font-bold">{achievementCount}</p>
          <Link href="/achievements" className="text-sm mt-2 opacity-80 hover:opacity-100 inline-block">
            View all achievements →
          </Link>
        </div>
      </div>

      {/* Top Behaviors */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Top Behaviors
        </h2>
        
        {topBehaviors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBehaviors.map((behavior) => (
              <BehaviorCard key={behavior._id} behavior={behavior} />
            ))}
          </div>
        ) : (
          <div className="card bg-gray-50 dark:bg-gray-800 text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don&apos;t have any behaviors yet. Create your first one to get started!
            </p>
            <Link href="/behaviors" className="btn-primary">
              Create Behavior
            </Link>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="card">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-3 flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${activity.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.text}
                    </p>
                    {activity.behavior && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.behavior.title}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.updatedAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/behaviors" 
          className="card hover:shadow-lg transition-shadow flex flex-col items-center text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Behaviors</h3>
          <p className="text-gray-600 dark:text-gray-400">Create, edit, and organize your self-improvement areas</p>
        </Link>
        
        <Link 
          href="/stats" 
          className="card hover:shadow-lg transition-shadow flex flex-col items-center text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">View Statistics</h3>
          <p className="text-gray-600 dark:text-gray-400">Track your progress with detailed charts and analytics</p>
        </Link>
        
        <Link 
          href="/achievements" 
          className="card hover:shadow-lg transition-shadow flex flex-col items-center text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Achievements</h3>
          <p className="text-gray-600 dark:text-gray-400">Unlock rewards for hitting milestones in your journey</p>
        </Link>
      </div>
    </div>
  );
}