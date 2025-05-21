import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Card, CardContent, CardActions } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { joinClass, createClass, getClasses } from '../../redux/actions/class';
import { setAlert } from '../../redux/actions/alert';

const Classes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes, loading, error: classError } = useSelector((state) => state.classes);
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    grade: '',
    academicYear: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setClassCode('');
  };

  const handleCreateDialogOpen = () => setCreateDialogOpen(true);
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewClass({
      name: '',
      description: '',
      grade: '',
      academicYear: ''
    });
  };

  const handleJoinClass = async () => {
    try {
      await dispatch(joinClass(classCode));
      handleClose();
    } catch (err) {
      console.error('加入班級失敗:', err);
    }
  };

  const handleCreateClass = async () => {
    try {
      setFormError('');
      const result = await dispatch(createClass(newClass));
      if (result) {
        dispatch(setAlert('課程創建成功', 'success'));
        handleCreateDialogClose();
        // 重新載入課程列表
        dispatch(getClasses());
      }
    } catch (err) {
      console.error('創建班級失敗:', err);
      setFormError(err.response?.data?.message || '創建班級失敗，請稍後再試');
    }
  };

  const handleInputChange = (e) => {
    setNewClass({
      ...newClass,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography>載入中...</Typography>
        </Box>
      </Container>
    );
  }

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
              onClick={handleCreateDialogOpen}
            >
              新增課程
            </Button>
          )}
        </Box>
      </Box>

      {classError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {classError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {classes && classes.length > 0 ? (
          classes.map((classItem) => (
            <Grid item xs={12} sm={6} md={4} key={classItem._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {classItem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {classItem.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    年級：{classItem.grade}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    學年：{classItem.academicYear}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    查看詳情
                  </Button>
                  {(isTeacher || isAdmin) && (
                    <>
                      <Button size="small" color="primary">
                        編輯
                      </Button>
                      <Button size="small" color="error">
                        刪除
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                尚無課程記錄
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* 加入班級對話框 */}
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

      {/* 新增課程對話框 */}
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>新增課程</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="課程名稱"
              name="name"
              value={newClass.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="課程描述"
              name="description"
              value={newClass.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="年級"
              name="grade"
              value={newClass.grade}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="學年"
              name="academicYear"
              value={newClass.academicYear}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>取消</Button>
          <Button 
            onClick={handleCreateClass} 
            variant="contained" 
            color="primary"
            disabled={!newClass.name || !newClass.grade || !newClass.academicYear}
          >
            確認創建
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Classes; 