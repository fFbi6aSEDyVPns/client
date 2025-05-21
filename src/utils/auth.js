import { STORAGE_KEYS } from '../constants';
import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Set authentication token to local storage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Get authentication token from local storage
 * @returns {string|null} - JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from local storage
 */
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

/**
 * Set user information in local storage
 * @param {object} user - User information
 */
export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Get user information from local storage
 * @returns {object|null} - User information or null
 */
export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user information from local storage
 */
export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Get user role from local storage
 * @returns {string|null} - User role or null
 */
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

/**
 * Check if user has specified role
 * @param {string} role - User role to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Clear all authentication data from local storage
 */
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  delete api.defaults.headers.common['Authorization'];
};

// 檢查 token 是否過期
const isTokenExpired = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    return exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// 設置 token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem(TOKEN_KEY);
  }
};

// 獲取用戶信息
export const getUserInfo = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('解析用戶信息錯誤:', error);
    return null;
  }
};

// 設置用戶信息
export const setUserInfo = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};