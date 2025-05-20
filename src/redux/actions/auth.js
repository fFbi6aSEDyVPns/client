import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_ERRORS
} from './types';
import { setAlert } from './alert';
import api from '../../utils/api';
import setAuthToken from '../../utils/setAuthToken';

/**
 * Load user data if authenticated
 */
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await api.get('/auth');

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
export const register = formData => async dispatch => {
  try {
    const res = await api.post('/users', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    loadUser();
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.message || '註冊失敗'
    });
  }
};

/**
 * Login user
 * @param {object} credentials - User login credentials
 */
export const login = formData => async dispatch => {
  try {
    const res = await api.post('/auth', formData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    loadUser();
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || '登入失敗'
    });
  }
};

/**
 * Logout user
 */
export const logout = () => dispatch => {
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