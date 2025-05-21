import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { getClasses } from '../../redux/actions/class';

const ClassList = () => {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => {
    console.log('ClassList useSelector - state:', state); // 添加日誌
    return state.class;
  });

  useEffect(() => {
    console.log('ClassList useEffect - dispatching getClasses'); // 添加日誌
    dispatch(getClasses());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // 確保 classes 是數組並過濾掉無效的項目
  const classList = Array.isArray(classes) 
    ? classes.filter(item => {
        console.log('ClassList - filtering item:', item); // 添加日誌
        return item && (item._id || item.id);
      })
    : [];

  console.log('ClassList - classes:', classes); // 添加日誌
  console.log('ClassList - classList:', classList); // 添加日誌
  console.log('ClassList - loading:', loading);
  console.log('ClassList - error:', error);
  console.log('ClassList - classList.length:', classList.length);

  // 添加更多日誌
  console.log('ClassList - rendering with classList:', classList);
  console.log('ClassList - classList is array:', Array.isArray(classList));
  console.log('ClassList - classList type:', typeof classList);

  // 添加更多日誌
  console.log('ClassList - first item:', classList[0]);
  console.log('ClassList - first item keys:', classList[0] ? Object.keys(classList[0]) : []);

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            我的班級
          </Typography>
          <Button
            component={Link}
            to="/create-class"
            variant="contained"
            color="primary"
          >
            創建新班級
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {classList && classList.length > 0 ? (
          <Grid container spacing={3}>
            {classList.map((classItem) => {
              // 確保每個班級項目都有唯一的 ID
              const classId = classItem._id || classItem.id;
              if (!classId) {
                console.warn('Class item missing ID:', classItem);
                return null;
              }

              console.log('ClassList - rendering class item:', classItem); // 添加日誌

              return (
                <Grid item xs={12} sm={6} md={4} key={classId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {classItem.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        年級：{classItem.grade}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        屆數：{classItem.academicYear}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {classItem.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        to={`/classes/${classId}`}
                        size="small"
                        color="primary"
                      >
                        查看詳情
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="textSecondary">
              還沒有加入任何班級
            </Typography>
            <Box mt={2}>
              <Button
                component={Link}
                to="/create-class"
                variant="contained"
                color="primary"
              >
                創建第一個班級
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ClassList; 