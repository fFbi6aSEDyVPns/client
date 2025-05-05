import axios from 'axios';
import store from '../redux/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    
    // Handle 401 unauthorized globally (token expired)
    if (status === 401) {
      // Dispatch logout action if token is expired
      // Import logout action asynchronously to avoid circular dependencies
      import('../redux/actions/auth').then(({ logout }) => {
        store.dispatch(logout());
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;