import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  LOADING_USER,
  AUTH_ERROR,
  LOGOUT
} from './type';
import api from '../../services/api';
import { setToken, removeToken, setUser, removeUser } from '../../utils/auth';

/**
 * Load user data if authenticated
 */
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });

    const res = await api.get('/auth/user');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
    
    setUser(res.data);
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
    removeToken();
    removeUser();
  }
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 */
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const res = await api.post('/auth/register', userData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    
    setToken(res.data.token);
    setUser(res.data.user);
    
    dispatch(loadUser());
    
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Registration failed';
    
    dispatch({
      type: REGISTER_FAIL,
      payload: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

/**
 * Login user
 * @param {object} credentials - User login credentials
 */
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const res = await api.post('/auth/login', credentials);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    
    setToken(res.data.token);
    setUser(res.data.user);
    
    dispatch(loadUser());
    
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Login failed';
    
    dispatch({
      type: LOGIN_FAIL,
      payload: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

/**
 * Logout user
 */
export const logout = () => (dispatch) => {
  removeToken();
  removeUser();
  
  dispatch({ type: LOGOUT });
};