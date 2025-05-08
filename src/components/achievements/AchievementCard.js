'use client';

export default function AchievementCard({ achievement }) {
  const isEarned = achievement.earned;

  return (
    <div 
      className={`card transition-all duration-300 ${
        isEarned 
          ? 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900 dark:to-gray-800' 
          : 'border border-gray-200 dark:border-gray-700 opacity-75'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-full ${
            isEarned 
              ? 'bg-primary-100 dark:bg-primary-800' 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
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
          {isEarned && achievement.dateEarned && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
            </p>
          )}
          {!isEarned && (
            <div className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
              Locked
            </div>
          )}
        </div>
      </div>
    </div>
  );
}