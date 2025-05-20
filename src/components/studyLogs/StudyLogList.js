import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getStudyLogs, deleteStudyLog } from '../../services/studyLogService';
import Spinner from '../common/Spinner';

const StudyLogList = ({ classId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getStudyLogs(classId);
        setLogs(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch study logs:', err);
        setError(err.message || '無法載入學習日誌');
        setLoading(false);
      }
    };

    fetchLogs();
  }, [classId]);

  const handleEdit = (logId) => {
    navigate(`/study-logs/${classId}/${logId}/edit`);
  };

  const handleDelete = async (logId) => {
    if (window.confirm('確定要刪除此學習日誌嗎？')) {
      try {
        await deleteStudyLog(logId);
        setLogs(logs.filter(log => log._id !== logId));
      } catch (err) {
        console.error('Failed to delete study log:', err);
        setError(err.message || '無法刪除學習日誌');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box my={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Box my={2}>
        <Typography>尚無學習日誌</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/study-logs/${classId}/new`)}
          sx={{ mt: 2 }}
        >
          新增學習日誌
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">學習日誌列表</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/study-logs/${classId}/new`)}
        >
          新增學習日誌
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>學習內容</TableCell>
              <TableCell>學習時數</TableCell>
              <TableCell>備註</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>{log.content}</TableCell>
                <TableCell>{log.hours}</TableCell>
                <TableCell>{log.notes}</TableCell>
                <TableCell>
                  <Tooltip title="編輯">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(log._id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="刪除">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(log._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudyLogList; 