import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import StudyLogList from '../components/studyLogs/StudyLogList';
import StudyLogForm from '../components/studyLogs/StudyLogForm';
import { getClass } from '../services/classService';
import Spinner from '../components/common/Spinner';

const StudyLogs = () => {
  const { classId, logId, action } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        if (!user.class) {
          throw new Error('您尚未被分配到任何班級');
        }
        const data = await getClass(user.class);
        setClassData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load class:", err);
        setError(err.message || 'Failed to load class information');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [user.class]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container>
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
            >
              返回儀表板
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!classData) {
    return (
      <Container>
        <Box my={4}>
          <Alert severity="warning">找不到班級資料</Alert>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
            >
              返回儀表板
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  // Check if user is enrolled in this class or is a teacher
  const isTeacher = user.role === 'teacher';
  const isEnrolled = classData.students.some(student => student._id === user._id);
  const isClassTeacher = isTeacher && classData.teacher._id === user._id;

  if (!isEnrolled && !isClassTeacher) {
    return (
      <Container>
        <Box my={4}>
          <Alert severity="warning">
            您不是此班級的學生或教師，無法查看學習日誌。
          </Alert>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
            >
              返回儀表板
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  // Render different components based on URL parameters
  const renderContent = () => {
    // Create a new study log
    if (action === 'new' && isEnrolled) {
      return <StudyLogForm />;
    }
    
    // Edit an existing study log
    if (logId && action === 'edit' && isEnrolled) {
      return <StudyLogForm />;
    }
    
    // Default: show study log list
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {classData.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {classData.description}
        </Typography>
        <StudyLogList classId={classData._id} />
      </Box>
    );
  };

  return (
    <Container>
      <Box my={4}>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default StudyLogs;