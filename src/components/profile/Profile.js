import React from 'react';
import { Container, Typography, Paper, Box, Button, Grid } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const Profile = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          個人資料
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
        >
          編輯資料
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              基本資料
            </Typography>
            {/* 個人資料將在這裡動態顯示 */}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 