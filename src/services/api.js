import axios from 'axios';
import store from '../redux/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10秒超時
  withCredentials: true // 允許跨域請求攜帶憑證
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('發送請求:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('請求錯誤:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('收到響應:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (!error.response) {
      // 網路錯誤或伺服器未響應
      console.error('網路錯誤:', error.message);
      return Promise.reject({
        message: '無法連接到伺服器，請檢查：\n1. 後端伺服器是否正在運行\n2. 網路連接是否正常\n3. 後端地址是否正確'
      });
    }

    const { status, data } = error.response;
    console.error('API 錯誤:', {
      status,
      data,
      url: error.config.url,
      method: error.config.method
    });
    
    // Handle 401 unauthorized globally (token expired)
    if (status === 401) {
      // Dispatch logout action if token is expired
      import('../redux/actions/auth').then(({ logout }) => {
        store.dispatch(logout());
      });
      return Promise.reject({
        message: '登入已過期，請重新登入'
      });
    }
    
    // Handle 403 forbidden
    if (status === 403) {
      return Promise.reject({
        message: '您沒有權限執行此操作'
      });
    }
    
    // Handle 404 not found
    if (status === 404) {
      return Promise.reject({
        message: '請求的資源不存在'
      });
    }
    
    // Handle 500 server error
    if (status === 500) {
      return Promise.reject({
        message: '伺服器發生錯誤，請稍後再試'
      });
    }

    // 其他錯誤
    return Promise.reject({
      message: data.message || '發生未知錯誤'
    });
  }
);

export default api;