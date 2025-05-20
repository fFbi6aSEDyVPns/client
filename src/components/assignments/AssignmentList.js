import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { getAssignments, deleteAssignment } from '../../redux/actions/assignment';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const AssignmentList = ({ classId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector(state => state.assignment);
  const { user } = useSelector(state => state.auth);
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    dispatch(getAssignments(classId));
  }, [dispatch, classId]);

  const handleDelete = async (assignmentId) => {
    if (window.confirm('確定要刪除此作業嗎？')) {
      try {
        await dispatch(deleteAssignment(assignmentId));
      } catch (err) {
        console.error('刪除作業失敗:', err);
      }
    }
  };

  const getStatusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (now > due) return 'error';
    if (now.getTime() + 24 * 60 * 60 * 1000 > due.getTime()) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Paper elevation={3}>
          <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1">
                作業列表
              </Typography>
              {isTeacher && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/classes/${classId}/assignments/new`)}
                >
                  新增作業
                </Button>
              )}
            </Box>

            {assignments.length === 0 ? (
              <Box textAlign="center" py={4}>
                <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  目前沒有作業
                </Typography>
              </Box>
            ) : (
              <List>
                {assignments.map((assignment, index) => (
                  <React.Fragment key={assignment._id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6">
                              {assignment.title}
                            </Typography>
                            <Chip
                              label={format(new Date(assignment.dueDate), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                              color={getStatusColor(assignment.dueDate)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {assignment.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              分數：{assignment.pointsPossible}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box display="flex" gap={1}>
                          <IconButton
                            edge="end"
                            onClick={() => navigate(`/classes/${classId}/assignments/${assignment._id}`)}
                          >
                            <AssignmentIcon />
                          </IconButton>
                          {isTeacher && (
                            <>
                              <IconButton
                                edge="end"
                                onClick={() => navigate(`/classes/${classId}/assignments/${assignment._id}/edit`)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleDelete(assignment._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AssignmentList;