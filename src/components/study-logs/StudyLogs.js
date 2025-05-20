import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createStudyLog } from '../../redux/actions/studyLog';

const StudyLogs = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    duration: '',
    content: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createStudyLog(formData));
      handleClose();
      setFormData({
        subject: '',
        duration: '',
        content: ''
      });
    } catch (err) {
      console.error('創建學習記錄失敗:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          學習記錄
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          新增記錄
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 學習記錄列表將在這裡動態生成 */}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>新增學習記錄</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="科目"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="數學">數學</MenuItem>
              <MenuItem value="英文">英文</MenuItem>
              <MenuItem value="物理">物理</MenuItem>
              <MenuItem value="化學">化學</MenuItem>
              <MenuItem value="生物">生物</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="學習時長（小時）"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.5 }}
            />
            <TextField
              fullWidth
              label="學習內容"
              name="content"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            確認
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudyLogs; 