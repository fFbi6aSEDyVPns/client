import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { School, Assignment, Book } from '@mui/icons-material';

const Landing = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          歡迎使用教育平台
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          一個整合學習、作業和課程管理的綜合平台
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            立即註冊
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
          >
            登入
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              課程管理
            </Typography>
            <Typography color="text.secondary">
              輕鬆管理您的課程，查看課程表，追蹤學習進度
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              作業追蹤
            </Typography>
            <Typography color="text.secondary">
              管理作業提交，查看評分，追蹤完成情況
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Book sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              學習記錄
            </Typography>
            <Typography color="text.secondary">
              記錄學習時間，分析學習效率，制定學習計劃
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing; 