import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from '@material-ui/core';

const Dashboard = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4">Welcome, {user.name}!</Typography>
        <Typography variant="body1" color="textSecondary">
          {user.role === 'student' && 'Student'}
          {user.role === 'monitor' && 'Classleader'}
          {user.role === 'teacher' && 'Teacher'}
          {user.role === 'admin' && 'Admin'}
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
              Pending Assignments 
              </Typography>
              <Typography variant="body1">
              No assignment data available yet. It will be displayed later.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
              Today's Classes
              </Typography>
              <Typography variant="body1">
              No course data available yet. It will be displayed later.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
              Study Time Statistics
              </Typography>
              <Typography variant="body1">
              No study record data available yet, it will be displayed later.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;