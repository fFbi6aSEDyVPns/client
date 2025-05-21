import api from '../services/api';

const setAuthToken = (token) => {
  console.log('setAuthToken 被調用:', { token });
  
  if (token) {
    console.log('設置 Authorization 頭...');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('存儲 token 到 localStorage...');
    localStorage.setItem('token', token);
    console.log('設置完成，當前請求頭:', api.defaults.headers.common);
  } else {
    console.log('清除 Authorization 頭...');
    delete api.defaults.headers.common['Authorization'];
    console.log('從 localStorage 移除 token...');
    localStorage.removeItem('token');
    console.log('清除完成，當前請求頭:', api.defaults.headers.common);
  }
};

export default setAuthToken; 