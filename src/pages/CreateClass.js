import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  MenuItem
} from '@mui/material';
import { createClass } from '../redux/actions/classActions';

const CreateClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    academicYear: '',
    description: ''
  });

  const { name, grade, academicYear, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(createClass(formData, navigate));
  };

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
            創建班級
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
              創建班級
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateClass; 