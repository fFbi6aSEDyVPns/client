import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Grade as GradeIcon
} from '@mui/icons-material';
import { getAssignment, deleteAssignment, submitAssignment, gradeAssignment } from '../../redux/actions/assignment';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const AssignmentDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classId, assignmentId } = useParams();
  const { assignment, loading, error } = useSelector(state => state.assignment);
  const { user } = useSelector(state => state.auth);
  const isTeacher = user?.role === 'teacher';
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(getAssignment(assignmentId));
  }, [dispatch, assignmentId]);

  const handleDelete = async () => {
    if (window.confirm('確定要刪除此作業嗎？')) {
      try {
        await dispatch(deleteAssignment(assignmentId));
        navigate(`/classes/${classId}/assignments`);
      } catch (err) {
        console.error('刪除作業失敗:', err);
      }
    }
  };

  const handleFileChange = (e) => {
    setSubmissionFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    submissionFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      await dispatch(submitAssignment(assignmentId, formData));
      setSubmissionDialogOpen(false);
      setSubmissionFiles([]);
    } catch (err) {
      console.error('提交作業失敗:', err);
    }
  };

  const handleGrade = async () => {
    try {
      await dispatch(gradeAssignment(assignmentId, {
        grade: Number(grade),
        feedback
      }));
      setGradingDialogOpen(false);
      setGrade('');
      setFeedback('');
    } catch (err) {
      console.error('評分失敗:', err);
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

  if (!assignment) {
    return (
      <Box my={2}>
        <Alert severity="info">找不到作業</Alert>
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
                {assignment.title}
              </Typography>
              <Box display="flex" gap={1}>
                {isTeacher ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/classes/${classId}/assignments/${assignmentId}/edit`)}
                    >
                      編輯
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                    >
                      刪除
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => setSubmissionDialogOpen(true)}
                    disabled={new Date() > new Date(assignment.dueDate)}
                  >
                    提交作業
                  </Button>
                )}
              </Box>
            </Box>

            <Box mb={3}>
              <Chip
                label={`截止日期：${format(new Date(assignment.dueDate), 'yyyy/MM/dd HH:mm', { locale: zhTW })}`}
                color={getStatusColor(assignment.dueDate)}
                sx={{ mr: 1 }}
              />
              <Chip
                label={`分數：${assignment.pointsPossible}`}
                color="primary"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {assignment.description}
            </Typography>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  附件
                </Typography>
                <List>
                  {assignment.attachments.map((attachment, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachFileIcon />
                      </ListItemIcon>
                      <ListItemText primary={attachment.fileName} />
                      <IconButton
                        edge="end"
                        component="a"
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {!isTeacher && assignment.submission && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  我的提交
                </Typography>
                <List>
                  {assignment.submission.files.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachFileIcon />
                      </ListItemIcon>
                      <ListItemText primary={file.fileName} />
                      <IconButton
                        edge="end"
                        component="a"
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                {assignment.submission.grade !== undefined && (
                  <Box mt={2}>
                    <Typography variant="subtitle1">
                      分數：{assignment.submission.grade} / {assignment.pointsPossible}
                    </Typography>
                    {assignment.submission.feedback && (
                      <Typography variant="body2" color="text.secondary">
                        評語：{assignment.submission.feedback}
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}

            {isTeacher && assignment.submissions && assignment.submissions.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  學生提交
                </Typography>
                <List>
                  {assignment.submissions.map((submission, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={submission.student.name}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              提交時間：{format(new Date(submission.submittedAt), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                            </Typography>
                            {submission.grade !== undefined && (
                              <Typography variant="body2" component="div">
                                分數：{submission.grade} / {assignment.pointsPossible}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Button
                        variant="outlined"
                        startIcon={<GradeIcon />}
                        onClick={() => {
                          setGrade(submission.grade || '');
                          setFeedback(submission.feedback || '');
                          setGradingDialogOpen(true);
                        }}
                      >
                        評分
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        </Paper>
      </Box>

      {/* 提交作業對話框 */}
      <Dialog open={submissionDialogOpen} onClose={() => setSubmissionDialogOpen(false)}>
        <DialogTitle>提交作業</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="submission-files"
            />
            <label htmlFor="submission-files">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AttachFileIcon />}
              >
                選擇檔案
              </Button>
            </label>
            {submissionFiles.length > 0 && (
              <List>
                {submissionFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AttachFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submissionFiles.length === 0}
          >
            提交
          </Button>
        </DialogActions>
      </Dialog>

      {/* 評分對話框 */}
      <Dialog open={gradingDialogOpen} onClose={() => setGradingDialogOpen(false)}>
        <DialogTitle>評分作業</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              label="分數"
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              inputProps={{ min: 0, max: assignment.pointsPossible }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="評語"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradingDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleGrade}
            variant="contained"
            disabled={!grade || grade < 0 || grade > assignment.pointsPossible}
          >
            提交評分
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignmentDetail;