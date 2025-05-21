import api from '../../services/api';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../../utils/setAuthToken';

/**
 * Load user data if authenticated
 */
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('loadUser - 從 localStorage 獲取的 token:', token);
  
  if (!token) {
    console.log('沒有找到 token，跳過加載用戶信息');
    return;
  }

  try {
    console.log('設置 token 到請求頭...');
    setAuthToken(token);
    console.log('當前請求頭:', api.defaults.headers.common);
    
    console.log('發送 /auth/me 請求...');
    const res = await api.get('/auth/me');
    console.log('/auth/me 響應:', res.data);
    
    dispatch({
      type: USER_LOADED,
      payload: res.data.data
    });
  } catch (err) {
    console.error('加載用戶信息失敗:', err);
    dispatch({
      type: AUTH_ERROR
    });
  }
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 */
export const register = ({ name, email, password }) => async (dispatch) => {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.token);
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.msg || '註冊失敗'
    });
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const login = (email, password) => async (dispatch) => {
  try {
    console.log('開始登入請求...', { email });
    const res = await api.post('/auth/login', { email, password });
    console.log('登入響應:', res.data);
    
    if (res.data.token) {
      console.log('設置 token...', res.data.token);
      setAuthToken(res.data.token);
      
      // 驗證 token 是否正確存儲
      const storedToken = localStorage.getItem('token');
      console.log('Token 存儲驗證:', {
        stored: storedToken,
        matches: storedToken === res.data.token
      });
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      console.log('開始加載用戶信息...');
      dispatch(loadUser());
    } else {
      console.error('登入響應中沒有 token:', res.data);
      dispatch({
        type: LOGIN_FAIL,
        payload: '登入失敗：未收到有效的 token'
      });
    }
  } catch (err) {
    console.error('登入錯誤:', err);
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.msg || '登入失敗'
    });
  }
};

/**
 * Logout user
 */
export const logout = () => (dispatch) => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
};

/**
 * Update user profile
 * @param {object} formData - User profile update data
 */
export const updateProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/auth/profile', formData);
    dispatch({
      type: USER_LOADED,
      payload: res.data.user
    });
    dispatch(setAlert('個人資料已更新', 'success'));
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response?.data?.message || '更新個人資料失敗'
    });
    dispatch(setAlert(err.response?.data?.message || '更新個人資料失敗', 'error'));
  }
};

/**
 * Clear errors
 */
export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};