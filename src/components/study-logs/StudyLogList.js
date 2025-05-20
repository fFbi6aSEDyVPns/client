import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStudyLogs, deleteStudyLog } from '../../redux/actions/studyLog';
import { setAlert } from '../../redux/actions/alert';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const StudyLogList = () => {
  const dispatch = useDispatch();
  const { studyLogs, loading } = useSelector(state => state.studyLog);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getStudyLogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除這條學習記錄嗎？')) {
      dispatch(deleteStudyLog(id));
    }
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
      <CardHeader
        title="學習記錄"
        action={
          <Button
            component={Link}
            to="/study-logs/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            新增記錄
          </Button>
        }
      />
      <CardContent>
        {studyLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            暫無學習記錄
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>日期</TableCell>
                  <TableCell>課程</TableCell>
                  <TableCell>學習時長</TableCell>
                  <TableCell>學習內容</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studyLogs.map(log => (
                  <TableRow key={log._id}>
                    <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                    <TableCell>{log.course}</TableCell>
                    <TableCell>{log.duration} 分鐘</TableCell>
                    <TableCell>{log.content}</TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/study-logs/${log._id}`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(log._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyLogList;