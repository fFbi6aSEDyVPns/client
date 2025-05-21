import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { getClasses } from '../../redux/actions/class';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { classes, loading: classesLoading } = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  if (authLoading || classesLoading) {
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    我的班級
                  </Typography>
                  {user.role === 'teacher' && (
                    <Button
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to="/create-class"
                    >
                      創建新班級
                    </Button>
                  )}
                </Box>
                {Array.isArray(classes) && classes.length > 0 ? (
                  <List>
                    {classes.map((classItem) => (
                      <React.Fragment key={classItem._id}>
                        <ListItem
                          button
                          component={RouterLink}
                          to={`/classes/${classItem._id}`}
                        >
                          <ListItemText
                            primary={classItem.name}
                            secondary={classItem.description}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary" align="center">
                    還沒有加入任何班級
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 