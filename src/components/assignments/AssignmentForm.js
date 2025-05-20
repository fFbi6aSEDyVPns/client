import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addAssignment, editAssignment } from '../../redux/actions/assignment';

const AssignmentForm = ({ classId, assignment = null, isEditing = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate ? new Date(assignment.dueDate) : new Date(),
    pointsPossible: assignment?.pointsPossible || 100,
    attachments: assignment?.attachments || []
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '請輸入作業標題';
    }

    if (!formData.description.trim()) {
      newErrors.description = '請輸入作業說明';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = '請選擇截止日期';
    } else if (formData.dueDate < new Date()) {
      newErrors.dueDate = '截止日期不能早於現在';
    }

    if (!formData.pointsPossible || formData.pointsPossible < 0) {
      newErrors.pointsPossible = '請輸入有效的分數';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date
    });
    setErrors({
      ...errors,
      dueDate: ''
    });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('請檢查表單錯誤');
      return;
    }

    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dueDate', formData.dueDate.toISOString());
    formDataToSend.append('pointsPossible', formData.pointsPossible);
    formDataToSend.append('classId', classId);

    files.forEach(file => {
      formDataToSend.append('files', file);
    });

    try {
      if (isEditing) {
        await dispatch(editAssignment(assignment._id, formDataToSend));
      } else {
        await dispatch(addAssignment(formDataToSend));
      }
      navigate(`/classes/${classId}/assignments`);
    } catch (err) {
      setError(err.message || '儲存作業失敗，請稍後再試');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Paper elevation={3}>
          <Box p={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEditing ? '編輯作業' : '新增作業'}
            </Typography>
            
            {error && (
              <Box mb={2}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="作業標題"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="作業說明"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                margin="normal"
                multiline
                rows={4}
                required
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box mt={2} mb={2}>
                  <DatePicker
                    label="截止日期"
                    value={formData.dueDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                        required
                      />
                    )}
                  />
                </Box>
              </LocalizationProvider>

              <TextField
                fullWidth
                label="分數"
                name="pointsPossible"
                type="number"
                value={formData.pointsPossible}
                onChange={handleChange}
                error={!!errors.pointsPossible}
                helperText={errors.pointsPossible}
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="files">附件</InputLabel>
                <Input
                  id="files"
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ multiple: true }}
                />
                <FormHelperText>
                  可以選擇多個檔案
                </FormHelperText>
              </FormControl>

              {isEditing && formData.attachments.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    現有附件
                  </Typography>
                  <ul>
                    {formData.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                          {attachment.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              <Box mt={3} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/classes/${classId}/assignments`)}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : isEditing ? (
                    '更新作業'
                  ) : (
                    '新增作業'
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AssignmentForm;