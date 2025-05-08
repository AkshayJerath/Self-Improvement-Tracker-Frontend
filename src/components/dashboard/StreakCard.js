'use client';

export default function StreakCard({ currentStreak, maxStreak, activeDays }) {
  const renderStreakDots = (count, max = 7) => {
    return (
      <div className="flex space-x-1 justify-center mt-2">
        {Array.from({ length: max }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < count ? 'bg-white' : 'bg-white bg-opacity-30'
            }`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
      <h3 className="text-lg font-medium mb-2">Current Streak</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{currentStreak || 0}</p>
          <p className="text-sm mt-1 opacity-80">
            {currentStreak === 1 ? 'day' : 'days'} in a row
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-80">Best: {maxStreak || 0} days</p>
          <p className="text-sm opacity-80">Active: {activeDays || 0} days total</p>
        </div>
      </div>
      
      {renderStreakDots(currentStreak)}

      {currentStreak > 0 && (
        <div className="mt-4 text-center">
          <div className="inline-block bg-white bg-opacity-20 text-white text-sm px-2 py-1 rounded">
            {currentStreak >= 7 ? 'Excellent streak! 🔥' : 
             currentStreak >= 3 ? 'Great progress! 👏' : 
             'Keep it going! 💪'}
          </div>
        </div>
      )}
    </div>
  );
}