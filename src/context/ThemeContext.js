'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import themeUtils from '@/utils/theme';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First check for saved theme in cookies
    const savedTheme = Cookies.get('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      themeUtils.applyTheme(savedTheme);
    } else {
      // Check for user preference in API if logged in
      const token = Cookies.get('accessToken');
      if (token) {
        fetchUserTheme();
      } else {
        // Default to system preference
        checkSystemPreference();
      }
    }
    
    setLoading(false);
  }, []);

  const fetchUserTheme = async () => {
    try {
      const res = await axios.get('/auth/me');
      if (res.data.data?.preferences?.theme) {
        const userTheme = res.data.data.preferences.theme;
        setTheme(userTheme);
        Cookies.set('theme', userTheme, { expires: 365 });
        themeUtils.applyTheme(userTheme);
      } else {
        checkSystemPreference();
      }
    } catch (error) {
      console.error('Error fetching user theme:', error);
      checkSystemPreference();
    }
  };

  const checkSystemPreference = () => {
    if (typeof window !== 'undefined') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
      Cookies.set('theme', systemTheme, { expires: 365 });
      themeUtils.applyTheme(systemTheme);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    Cookies.set('theme', newTheme, { expires: 365 });
    themeUtils.applyTheme(newTheme);
    
    // Update user preference if logged in
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        await axios.put('/auth/preferences', { theme: newTheme });
      } catch (error) {
        console.error('Error updating theme preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export { ThemeContext };