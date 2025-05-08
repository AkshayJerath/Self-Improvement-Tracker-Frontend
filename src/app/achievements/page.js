'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';

export default function AchievementsPage() {
  const { user, loading: authLoading } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAchievements, setShowNewAchievements] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchAchievements();
    }
  }, [user, authLoading]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      // Get existing achievements
      const res = await axios.get('/achievements');
      setAchievements(res.data.data.achievements || []);
      
      // Check for new achievements
      const checkRes = await axios.post('/achievements/check');
      
      if (checkRes.data.data.newAchievements && checkRes.data.data.newAchievements.length > 0) {
        setNewAchievements(checkRes.data.data.newAchievements);
        setShowNewAchievements(true);
      }
      
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeNewAchievementsModal = () => {
    setShowNewAchievements(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  // Group achievements by earned status
  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h1>
        <div className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-primary-900 dark:text-primary-300">
          {earnedAchievements.length} / {achievements.length} Unlocked
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-primary-600 h-2.5 rounded-full"
          style={{ 
            width: `${achievements.length > 0 ? (earnedAchievements.length / achievements.length) * 100 : 0}%`
          }}
        ></div>
      </div>

      {/* Earned Achievements */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Earned Achievements
        </h2>
        
        {earnedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="card bg-gradient-to-br from-primary-50 to-white dark:from-primary-900 dark:to-gray-800"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-primary-100 dark:bg-primary-800 rounded-full">
                      {achievement.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {achievement.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    {achievement.dateEarned && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-gray-50 dark:bg-gray-800 text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven&apos;t earned any achievements yet. Keep using the app to unlock them!
            </p>
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Locked Achievements
        </h2>
        
        {lockedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="card border border-gray-200 dark:border-gray-700 opacity-75"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700 rounded-full">
                      {achievement.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {achievement.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    <div className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                      Locked
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-gray-50 dark:bg-gray-800 text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Congratulations! You&apos;ve unlocked all available achievements.
            </p>
          </div>
        )}
      </div>

      {/* New achievements modal */}
      {showNewAchievements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-primary-100 rounded-full dark:bg-primary-900 mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                New Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!
              </h3>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {newAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 flex items-center justify-center text-xl bg-primary-100 dark:bg-primary-800 rounded-full">
                        {achievement.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={closeNewAchievementsModal}
                className="btn-primary"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}