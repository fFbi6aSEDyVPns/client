import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getClasses } from '../redux/actions/classActions';

const Classes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes, loading, error } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);

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

  if (error) {
    return (
      <Container>
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  const isTeacher = user && user.role === 'teacher';

  return (
    <Container>
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            班級列表
          </Typography>
          {isTeacher && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/classes/new')}
            >
              創建班級
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {classes && classes.length > 0 ? (
            classes.map((classItem) => (
              <Grid item xs={12} md={6} lg={4} key={classItem._id}>
                <Paper>
                  <Box p={3}>
                    <Typography variant="h6" gutterBottom>
                      {classItem.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      年級：{classItem.grade}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      學年：{classItem.academicYear}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      學生人數：{classItem.students?.length || 0}
                    </Typography>
                    {classItem.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {classItem.description}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper>
                <Box p={3}>
                  <Typography variant="body1">
                    目前沒有班級數據
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Classes; 