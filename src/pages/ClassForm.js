import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { createClass, updateClass, getClassDetails } from '../redux/actions/classActions';

const ClassForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);

  // 檢查用戶權限
  useEffect(() => {
    if (user && user.role !== 'teacher' && user.role !== 'admin') {
      navigate('/classes');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grade: '',
    academicYear: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      dispatch(getClassDetails(id));
    }
  }, [dispatch, id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // 清除錯誤
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入班級名稱';
    }
    
    if (!formData.grade.trim()) {
      newErrors.grade = '請選擇年級';
    }
    
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = '請選擇學年';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode) {
        await dispatch(updateClass(id, formData));
      } else {
        await dispatch(createClass({ ...formData, teacher: user._id }));
      }
      navigate('/classes');
    } catch (err) {
      console.error('提交表單失敗:', err);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/classes')}
            sx={{ mr: 2 }}
          >
            返回
          </Button>
          <Typography variant="h4" component="h1">
            {isEditMode ? '編輯班級' : '創建班級'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3}>
          <Box p={4}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="班級名稱"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="年級"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    error={!!errors.grade}
                    helperText={errors.grade}
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i + 1} value={`${i + 1}年級`}>
                        {i + 1}年級
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="學年"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    error={!!errors.academicYear}
                    helperText={errors.academicYear}
                    required
                  >
                    <MenuItem value="111學年度">111學年度</MenuItem>
                    <MenuItem value="112學年度">112學年度</MenuItem>
                    <MenuItem value="113學年度">113學年度</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="班級描述"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : isEditMode ? (
                        '更新班級'
                      ) : (
                        '創建班級'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ClassForm;
