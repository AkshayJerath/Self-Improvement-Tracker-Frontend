'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBehaviors } from '@/hooks/useBehaviors';
import axios from '@/lib/axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const { behaviors, getBehaviors } = useBehaviors();
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [behaviorStats, setBehaviorStats] = useState([]);
  const [selectedBehavior, setSelectedBehavior] = useState('');
  const [behaviorDetails, setBehaviorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedBehavior) {
      fetchBehaviorDetails(selectedBehavior);
    }
  }, [selectedBehavior]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get user behaviors
      const behaviorsData = await getBehaviors();
      
      // Get overall stats
      const statsRes = await axios.get('/stats');
      setStats(statsRes.data.data.summary);
      
      // Get streak data
      const streakRes = await axios.get('/stats/streak');
      setStreak(streakRes.data.data);
      
      // Get stats for each behavior
      const behaviorStatsPromises = behaviorsData.map(behavior => 
        axios.get(`/stats/behaviors/${behavior._id}`)
      );
      
      const behaviorStatsResults = await Promise.all(behaviorStatsPromises);
      const behaviorStatsData = behaviorStatsResults.map(res => res.data.data);
      setBehaviorStats(behaviorStatsData);
      
      // Set first behavior as selected by default
      if (behaviorsData.length > 0 && !selectedBehavior) {
        setSelectedBehavior(behaviorsData[0]._id);
      }
      
    } catch (error) {
      console.error('Error fetching stats data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBehaviorDetails = async (behaviorId) => {
    try {
      const res = await axios.get(`/stats/behaviors/${behaviorId}`);
      setBehaviorDetails(res.data.data);
    } catch (error) {
      console.error('Error fetching behavior details:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  // Prepare data for streak chart
  const streakChartData = {
    labels: streak?.dailyCompletions?.map(day => day._id) || [],
    datasets: [
      {
        label: 'Completed To dos',
        data: streak?.dailyCompletions?.map(day => day.count) || [],
        fill: true,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        tension: 0.4,
      },
    ],
  };

  // Prepare data for behaviors completion chart
  const behaviorCompletionData = {
    labels: behaviorStats.map(b => b.title),
    datasets: [
      {
        label: 'Completion Percentage',
        data: behaviorStats.map(b => b.completionPercentage),
        backgroundColor: behaviors.map(b => b.color || '#0ea5e9'),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for overall completion doughnut chart
  const completionDoughnutData = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [stats?.completedTodos || 0, (stats?.totalTodos || 0) - (stats?.completedTodos || 0)],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for selected behavior daily completions
  const behaviorDailyData = behaviorDetails ? {
    labels: behaviorDetails.dailyCompletions?.map(day => day._id) || [],
    datasets: [
      {
        label: 'Daily Completions',
        data: behaviorDetails.dailyCompletions?.map(day => day.count) || [],
        backgroundColor: behaviors.find(b => b._id === selectedBehavior)?.color || '#0ea5e9',
      },
    ],
  } : null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Statistics
      </h1>

      {/* Overall Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">Total Behaviors</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalBehaviors || 0}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">Total Todos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalTodos || 0}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">Completed</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.completedTodos || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats?.completionPercentage || 0}% completion rate
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">Current Streak</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{streak?.currentStreak || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Max: {streak?.maxStreak || 0} days
          </p>
        </div>
      </div>

      {/* Streak Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Activity Over Time</h2>
        {streak?.dailyCompletions && streak.dailyCompletions.length > 0 ? (
          <div className="h-80">
            <Line 
              data={streakChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      title: function(context) {
                        return new Date(context[0].label).toLocaleDateString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 py-6 text-center">
              No activity data available yet. Complete more to do's to see your activity over time.
          </p>
        )}
      </div>

      {/* Behavior Completion Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Completion by Behavior
          </h2>
          {behaviorStats.length > 0 ? (
            <div className="h-80">
              <Bar 
                data={behaviorCompletionData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-6 text-center">
              No behaviors data available. Add behaviors to see completion statistics.
            </p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Overall Completion
          </h2>
          {stats?.totalTodos > 0 ? (
            <div className="h-80 flex items-center justify-center">
              <div className="w-64">
                <Doughnut 
                  data={completionDoughnutData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-6 text-center">
              No todos data available. Add todos to see completion statistics.
            </p>
          )}
        </div>
      </div>

      {/* Behavior Specific Stats */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Behavior Details
        </h2>
        
        {behaviors.length > 0 ? (
          <>
            <div className="mb-6">
              <label htmlFor="behavior-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Behavior
              </label>
              <select
                id="behavior-select"
                value={selectedBehavior}
                onChange={(e) => setSelectedBehavior(e.target.value)}
                className="input"
              >
                {behaviors.map((behavior) => (
                  <option key={behavior._id} value={behavior._id}>
                    {behavior.title}
                  </option>
                ))}
              </select>
            </div>
            
            {behaviorDetails ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Items
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {behaviorDetails.totalTodos}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Completed
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {behaviorDetails.completedTodos}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Completion Rate
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {behaviorDetails.completionPercentage}%
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                    Completed Items (Last 7 Days)
                  </h3>
                  
                  {behaviorDetails.dailyCompletions && behaviorDetails.dailyCompletions.length > 0 ? (
                    <div className="h-64">
                      <Bar 
                        data={behaviorDailyData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              callbacks: {
                                title: function(context) {
                                  return new Date(context[0].label).toLocaleDateString();
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-6 text-center">
                      No recent activity data available for this behavior.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 py-6 text-center">
            No behaviors available. Create behaviors to see detailed statistics.
          </p>
        )}
      </div>
    </div>
  );
}