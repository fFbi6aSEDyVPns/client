import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Book as BookIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Typography variant="h4" color="error" gutterBottom>
            無法載入用戶資料
          </Typography>
        </Box>
      </Container>
    );
  }

  const roleText = {
    student: '學生',
    teacher: '教師',
    admin: '管理員'
  }[user.role] || user.role;

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          歡迎回來，{user.name || user.username || '用戶'}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h6" gutterBottom>
                  個人資料
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="用戶名"
                      secondary={user.username || '未設置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="姓名"
                      secondary={user.name || '未設置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="電子郵件"
                      secondary={user.email || '未設置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="角色"
                      secondary={roleText || '未設置'}
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h6" gutterBottom>
                  快速功能
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={RouterLink}
                      to="/classes"
                      variant="outlined"
                      fullWidth
                      startIcon={<SchoolIcon />}
                    >
                      我的班級
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={RouterLink}
                      to="/assignments"
                      variant="outlined"
                      fullWidth
                      startIcon={<AssignmentIcon />}
                    >
                      作業管理
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={RouterLink}
                      to="/schedule"
                      variant="outlined"
                      fullWidth
                      startIcon={<ScheduleIcon />}
                    >
                      課程表
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={RouterLink}
                      to="/study-logs"
                      variant="outlined"
                      fullWidth
                      startIcon={<BookIcon />}
                    >
                      學習記錄
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;