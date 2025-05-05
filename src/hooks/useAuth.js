import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../redux/actions/auth';
import { STORAGE_KEYS } from '../constants';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, error } = useSelector(state => state.auth);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData));
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate('/login');
  };

  const getAuthToken = () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  };

  const checkAuth = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getAuthToken,
    checkAuth
  };
};

export default useAuth;