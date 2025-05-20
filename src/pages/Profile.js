import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { getCurrentUser } from '../services/userService';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('正在載入用戶資料');
        const data = await getCurrentUser();
        console.log('載入到的用戶數據:', data);
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error("載入用戶資料失敗:", err);
        console.error("錯誤詳情:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message || '無法載入用戶資料');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container>
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
            >
              重新載入
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Box my={4}>
          <Alert severity="warning">找不到用戶資料</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          個人資料
        </Typography>
        <Paper elevation={3}>
          <Box p={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  用戶名
                </Typography>
                <Typography variant="body1" paragraph>
                  {userData.username}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  姓名
                </Typography>
                <Typography variant="body1" paragraph>
                  {userData.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  電子郵件
                </Typography>
                <Typography variant="body1" paragraph>
                  {userData.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  角色
                </Typography>
                <Typography variant="body1" paragraph>
                  {userData.role === 'student' ? '學生' :
                   userData.role === 'monitor' ? '班長' :
                   userData.role === 'teacher' ? '教師' :
                   userData.role === 'admin' ? '管理員' : userData.role}
                </Typography>
              </Grid>
              {userData.class && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    所屬班級
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {userData.class.name}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 