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
import { getClasses } from '../../redux/actions/class';

const Classes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes, loading } = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            班級列表
          </Typography>
          {user?.role === 'teacher' && (
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
          <Grid container spacing={3}>
            {classes.map((classItem) => (
              <Grid item xs={12} sm={6} md={4} key={classItem._id}>
                <Paper elevation={3}>
                  <Box p={3}>
                    <Typography variant="h6" gutterBottom>
                      {classItem.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {classItem.description}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/classes/${classItem._id}`}
                      variant="outlined"
                      color="primary"
                      fullWidth
                    >
                      查看詳情
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={3}>
            <Box p={4} textAlign="center">
              <Typography variant="h6" color="textSecondary" gutterBottom>
                還沒有加入任何班級
              </Typography>
              {user?.role === 'teacher' && (
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/create-class"
                  sx={{ mt: 2 }}
                >
                  創建第一個班級
                </Button>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Classes; 