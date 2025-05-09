/**
 * Application-wide constants
 */

// Default behavior colors
export const BEHAVIOR_COLORS = [
  { value: '#DC3545', name: 'Red' },
  { value: '#FD7E14', name: 'Orange' },
  { value: '#FFC107', name: 'Yellow' },
  { value: '#28A745', name: 'Green' },
  { value: '#17A2B8', name: 'Teal' },
  { value: '#0D6EFD', name: 'Blue' },
  { value: '#6F42C1', name: 'Purple' },
  { value: '#E83E8C', name: 'Pink' },
];

// Achievement icons
export const ACHIEVEMENT_ICONS = {
  first_behavior: '🌱',
  five_behaviors: '🏆',
  first_todo: '📝',
  first_completed: '✅',
  ten_completed: '🚀',
  fifty_completed: '💯',
  three_day_streak: '🔥',
  seven_day_streak: '📅',
  behavior_completion: '🌟',
  diverse_improvement: '🎭',
};

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  BEHAVIORS: '/behaviors',
  BEHAVIOR_DETAIL: (id) => `/behaviors/${id}`,
  STATS: '/stats',
  ACHIEVEMENTS: '/achievements',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Toast notification defaults
export const TOAST_OPTIONS = {
  duration: 4000,
  style: {
    background: '#363636',
    color: '#fff',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10B981',
      secondary: 'white',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#EF4444',
      secondary: 'white',
    },
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'self-improvement-theme',
  LANGUAGE: 'self-improvement-language',
};

// API error messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
};