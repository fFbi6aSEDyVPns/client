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
  Alert,
  Card,
  CardHeader,
  CardContent,
  Link,
} from '@mui/material';
import { login } from '../../redux/actions/auth';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('請輸入電子郵件和密碼');
      return;
    }

    try {
      await dispatch(login({ email, password }));
    } catch (err) {
      console.error('登入錯誤:', err);
      setLocalError(err.response?.data?.message || '登入失敗');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card>
          <CardHeader title="登入" />
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
                    name="email"
                    value={email}
                    onChange={onChange}
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
                    required
                  />
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
                    {loading ? '登入中...' : '登入'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    還沒有帳號？{' '}
                    <Link component={RouterLink} to="/register">
                      立即註冊
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

export default Login;