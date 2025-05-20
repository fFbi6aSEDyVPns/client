import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardHeader, CardContent, Typography } from '@mui/material';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <Grid container spacing={3} style={{ padding: '2rem' }}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="歡迎回來" />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              這是您的個人儀表板，您可以在這裡查看您的學習進度和相關資訊。
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="最近學習記錄" />
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              您還沒有任何學習記錄。
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="待辦事項" />
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              目前沒有待辦事項。
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 