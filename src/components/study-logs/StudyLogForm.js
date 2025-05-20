import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudyLog, updateStudyLog, getStudyLog } from '../../redux/actions/studyLog';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';

const StudyLogForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading } = useSelector(state => state.studyLog);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    course: '',
    duration: '',
    content: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getStudyLog(id));
    }
  }, [dispatch, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateStudyLog(id, formData));
    } else {
      dispatch(createStudyLog(formData));
    }
    navigate('/study-logs');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader title={id ? '編輯學習記錄' : '新增學習記錄'} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="日期"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="課程"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="學習時長（分鐘）"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="學習內容"
                name="content"
                multiline
                rows={4}
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {id ? '更新' : '新增'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudyLogForm;