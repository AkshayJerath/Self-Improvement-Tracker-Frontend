'use client';

import AchievementCard from './AchievementCard';

export default function AchievementGrid({ achievements, title, emptyMessage }) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="card bg-gray-50 dark:bg-gray-800 text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {emptyMessage || 'No achievements found.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}