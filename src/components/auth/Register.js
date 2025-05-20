import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  MenuItem,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Link,
} from '@mui/material';
import { register } from '../../redux/actions/auth';
import { ROLES } from '../../constants';
import { Link as RouterLink } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const { name, email, password, confirmPassword, role } = formData;

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = '請輸入姓名';
    }

    if (!email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件地址';
    }

    if (!password) {
      newErrors.password = '請輸入密碼';
    } else if (password.length < 6) {
      newErrors.password = '密碼至少需要6個字符';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '請確認密碼';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '密碼不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setLocalError('請檢查表單錯誤');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log('註冊請求數據:', registerData);
      const result = await dispatch(register(registerData));
      console.log('註冊響應:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('註冊錯誤:', err);
      setLocalError(err.response?.data?.message || '註冊失敗');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card>
          <CardHeader title="註冊" />
          <CardContent>
            {(error || localError) && (
              <Box mt={2}>
                <Alert severity="error">{error || localError}</Alert>
              </Box>
            )}
            <form onSubmit={onSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="用戶名"
                    name="name"
                    value={name}
                    onChange={onChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="電子郵件"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="密碼"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="確認密碼"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={onChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="角色"
                    name="role"
                    value={role}
                    onChange={onChange}
                  >
                    <MenuItem value={ROLES.STUDENT}>學生</MenuItem>
                    <MenuItem value={ROLES.TEACHER}>老師</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? '註冊中...' : '註冊'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    已有帳號？{' '}
                    <Link component={RouterLink} to="/login">
                      立即登入
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;