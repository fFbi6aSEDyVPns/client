import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper
} from '@mui/material';
import { createClass } from '../../redux/actions/class';

const CreateClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    description: '',
    academicYear: ''
  });

  const { name, grade, description, academicYear } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createClass(formData));
      if (result && result.success) {
        navigate('/classes');
      }
    } catch (err) {
      console.error('CreateClass onSubmit error:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            創建新班級
          </Typography>
          <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="班級名稱"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="年級"
                  name="grade"
                  value={grade}
                  onChange={onChange}
                  required
                >
                  <MenuItem value="七年級">七年級</MenuItem>
                  <MenuItem value="八年級">八年級</MenuItem>
                  <MenuItem value="九年級">九年級</MenuItem>
                  <MenuItem value="十年級">十年級</MenuItem>
                  <MenuItem value="十一年級">十一年級</MenuItem>
                  <MenuItem value="十二年級">十二年級</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="屆數"
                  name="academicYear"
                  value={academicYear}
                  onChange={onChange}
                  required
                  placeholder="例如：116"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="班級描述"
                  name="description"
                  value={description}
                  onChange={onChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/classes')}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    創建班級
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateClass; 