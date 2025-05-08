import { STORAGE_KEYS } from './constants';

/**
 * Theme utility functions
 */
const themeUtils = {
  /**
   * Get system theme preference (light or dark)
   * @returns {string} 'dark' or 'light'
   */
  getSystemTheme: () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light'; // Default to light
  },

  /**
   * Get saved theme from local storage
   * @returns {string|null} Saved theme or null if not found
   */
  getSavedTheme: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.THEME);
    }
    return null;
  },

  /**
   * Save theme to local storage
   * @param {string} theme - Theme to save ('dark' or 'light')
   */
  saveTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
  },

  /**
   * Apply theme to document
   * @param {string} theme - Theme to apply ('dark' or 'light')
   */
  applyTheme: (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  /**
   * Initialize theme based on saved preference or system preference
   * @returns {string} Applied theme
   */
  initializeTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = themeUtils.getSavedTheme();
      
      if (savedTheme) {
        themeUtils.applyTheme(savedTheme);
        return savedTheme;
      }
      
      const systemTheme = themeUtils.getSystemTheme();
      themeUtils.applyTheme(systemTheme);
      return systemTheme;
    }
    
    return 'light'; // Default to light
  },

  /**
   * Toggle theme between light and dark
   * @param {string} currentTheme - Current theme
   * @returns {string} New theme
   */
  toggleTheme: (currentTheme) => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    themeUtils.applyTheme(newTheme);
    themeUtils.saveTheme(newTheme);
    return newTheme;
  },

  /**
   * Listen for system theme changes
   * @param {Function} callback - Callback function to run when theme changes
   * @returns {Function} Function to remove listener
   */
  addSystemThemeListener: (callback) => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const listener = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        callback(newTheme);
      };
      
      // Add listener (using the appropriate method based on browser support)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        mediaQuery.addListener(listener);
      }
      
      // Return function to remove listener
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        } else {
          mediaQuery.removeListener(listener);
        }
      };
    }
    
    return () => {}; // No-op for SSR
  }
};

export default themeUtils;