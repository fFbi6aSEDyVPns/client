import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { joinClass } from '../../redux/actions/class';

const Classes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setClassCode('');
  };

  const handleJoinClass = async () => {
    try {
      await dispatch(joinClass(classCode));
      handleClose();
    } catch (err) {
      console.error('加入班級失敗:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          我的課程
        </Typography>
        <Box>
          {isStudent && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{ mr: 2 }}
            >
              加入班級
            </Button>
          )}
          {(isTeacher || isAdmin) && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              新增課程
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 課程列表將在這裡動態生成 */}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>加入班級</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="班級代碼"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              margin="normal"
              required
              helperText="請輸入教師提供的班級代碼"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button 
            onClick={handleJoinClass} 
            variant="contained" 
            color="primary"
            disabled={!classCode}
          >
            確認加入
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Classes; 