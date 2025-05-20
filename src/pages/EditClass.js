import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { getClass, updateClass } from '../redux/actions/classActions';

const EditClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentClass, loading } = useSelector((state) => state.classes);

  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    academicYear: '',
    description: ''
  });

  useEffect(() => {
    dispatch(getClass(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentClass) {
      setFormData({
        name: currentClass.name || '',
        grade: currentClass.grade || '',
        academicYear: currentClass.academicYear || '',
        description: currentClass.description || ''
      });
    }
  }, [currentClass]);

  const { name, grade, academicYear, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateClass(id, formData, navigate));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5">
            編輯班級
          </Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="班級名稱"
              name="name"
              autoFocus
              value={name}
              onChange={onChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="grade-label">年級</InputLabel>
              <Select
                labelId="grade-label"
                id="grade"
                name="grade"
                value={grade}
                label="年級"
                onChange={onChange}
              >
                <MenuItem value="一年級">一年級</MenuItem>
                <MenuItem value="二年級">二年級</MenuItem>
                <MenuItem value="三年級">三年級</MenuItem>
                <MenuItem value="四年級">四年級</MenuItem>
                <MenuItem value="五年級">五年級</MenuItem>
                <MenuItem value="六年級">六年級</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="academicYear-label">學年</InputLabel>
              <Select
                labelId="academicYear-label"
                id="academicYear"
                name="academicYear"
                value={academicYear}
                label="學年"
                onChange={onChange}
              >
                <MenuItem value="2023-2024">2023-2024</MenuItem>
                <MenuItem value="2024-2025">2024-2025</MenuItem>
                <MenuItem value="2025-2026">2025-2026</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="班級描述"
              name="description"
              multiline
              rows={4}
              value={description}
              onChange={onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              更新班級
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditClass; 