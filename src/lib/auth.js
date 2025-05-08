import Cookies from 'js-cookie';
import api from './api';

/**
 * Helper functions for authentication
 */
const auth = {
  /**
   * Set authentication tokens in cookies
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   */
  setTokens: (accessToken, refreshToken) => {
    Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { expires: 30 }); // 30 days
    }
  },

  /**
   * Remove authentication tokens from cookies
   */
  removeTokens: () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  },

  /**
   * Get access token from cookies
   * @returns {string|null} Access token or null if not found
   */
  getAccessToken: () => {
    return Cookies.get('accessToken') || null;
  },

  /**
   * Get refresh token from cookies
   * @returns {string|null} Refresh token or null if not found
   */
  getRefreshToken: () => {
    return Cookies.get('refreshToken') || null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    return !!Cookies.get('accessToken');
  },

  /**
   * Refresh the access token using the refresh token
   * @returns {Promise<string>} New access token
   */
  refreshAccessToken: async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.auth.refreshToken(refreshToken);
      
      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        auth.setTokens(accessToken, newRefreshToken);
        return accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      auth.removeTokens();
      throw error;
    }
  }
};

export default auth;