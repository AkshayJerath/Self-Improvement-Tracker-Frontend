'use client';

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/register', userData);
      
      if (res.data.success) {
        setUser(res.data.user);
        Cookies.set('accessToken', res.data.accessToken, { expires: 1 }); // 1 day
        Cookies.set('refreshToken', res.data.refreshToken, { expires: 30 }); // 30 days
        toast.success('Registration successful!');
        router.push('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/login', userData);
      
      if (res.data.success) {
        setUser(res.data.user);
        Cookies.set('accessToken', res.data.accessToken, { expires: 1 }); // 1 day
        Cookies.set('refreshToken', res.data.refreshToken, { expires: 30 }); // 30 days
        toast.success('Login successful!');
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      const token = Cookies.get('accessToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const res = await axios.get('/auth/me');
      setUser(res.data.data);
    } catch (error) {
      console.error('Auth check error:', error);
      // Try refreshing the token
      if (error.response?.status === 401) {
        await refreshToken();
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshTokenValue = Cookies.get('refreshToken');
      
      if (!refreshTokenValue) {
        setUser(null);
        return;
      }
      
      const res = await axios.post('/auth/refresh-token', {
        refreshToken: refreshTokenValue
      });
      
      if (res.data.success) {
        Cookies.set('accessToken', res.data.accessToken, { expires: 1 });
        Cookies.set('refreshToken', res.data.refreshToken, { expires: 30 });
        await checkUserLoggedIn();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push('/auth/login');
    }
  };

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};