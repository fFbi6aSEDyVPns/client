import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getStudyLog, createStudyLog, updateStudyLog } from '../../services/studyLogService';
import Spinner from '../common/Spinner';

const StudyLogForm = () => {
  const { classId, logId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: new Date(),
    content: '',
    hours: '',
    notes: ''
  });

  useEffect(() => {
    const fetchLog = async () => {
      if (logId) {
        try {
          setLoading(true);
          const data = await getStudyLog(logId);
          setFormData({
            date: new Date(data.date),
            content: data.content,
            hours: data.hours,
            notes: data.notes
          });
          setLoading(false);
        } catch (err) {
          console.error('Failed to fetch study log:', err);
          setError(err.message || '無法載入學習日誌');
          setLoading(false);
        }
      }
    };

    fetchLog();
  }, [logId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (logId) {
        await updateStudyLog(logId, formData);
      } else {
        await createStudyLog(classId, formData);
      }
      navigate(`/study-logs/${classId}`);
    } catch (err) {
      console.error('Failed to save study log:', err);
      setError(err.message || '無法儲存學習日誌');
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {logId ? '編輯學習日誌' : '新增學習日誌'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="日期"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="content"
              label="學習內容"
              value={formData.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="hours"
              label="學習時數"
              type="number"
              value={formData.hours}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="notes"
              label="備註"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {logId ? '更新' : '新增'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/study-logs/${classId}`)}
              >
                取消
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StudyLogForm; 