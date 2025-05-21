import axios from 'axios';
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
  
  if (token) {
    setAuthToken(token);
  } else {
    dispatch({
      type: AUTH_ERROR
    });
    return;
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
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
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);
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
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.token);
    dispatch(loadUser());
  } catch (err) {
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
    const res = await axios.put('/api/auth/profile', formData);
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