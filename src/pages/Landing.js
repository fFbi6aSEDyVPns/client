import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
} from '@material-ui/core';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom>
            Education Management Platform
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
            An All-in-One Education Platform Integrating Homework Management, Timetable, and Learning Time Tracking
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                style={{ marginRight: 16 }}
              >
                Register Now
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <Box p={4}>
                <Typography variant="h5" gutterBottom>
                Key Features
                </Typography>
                <Box mt={2}>
                  <Typography variant="body1">
                  ✓ Homework Organizer - Simplifies assignment posting, submission, and grading process
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant="body1">
                  ✓ Timetable Manager - Class-based course schedule, editable only by class leaders and teachers
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant="body1">
                  ✓ Study Time Tracker - Track study time and analyze learning habits
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;