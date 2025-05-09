'use client';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Loading Behavior Details
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we fetch the information...
        </p>
      </div>
    </div>
  );
}