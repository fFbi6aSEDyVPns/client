import React from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Assignments = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          作業管理
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          新增作業
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 作業列表將在這裡動態生成 */}
      </Grid>
    </Container>
  );
};

export default Assignments; 