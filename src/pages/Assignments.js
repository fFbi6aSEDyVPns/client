import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Alert,
  Button
} from '@mui/material';
import AssignmentList from '../components/assignments/AssignmentList';
import AssignmentForm from '../components/assignments/AssignmentForm';
import AssignmentDetail from '../components/assignments/AssignmentDetail';
import { getClass } from '../services/classService';
import Spinner from '../components/common/Spinner';

const Assignments = () => {
  const { classId, assignmentId, action } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        console.log('正在載入班級資料，班級ID:', classId);
        const data = await getClass(classId);
        console.log('載入到的班級數據:', data);
        
        // 檢查用戶權限
        const isTeacher = user.role === 'teacher';
        const isEnrolled = data.students.some(student => student._id === user._id);
        const isClassTeacher = isTeacher && data.teacher._id === user._id;

        if (!isEnrolled && !isClassTeacher) {
          throw new Error('您沒有權限查看此班級的作業');
        }

        setClassData(data);
        setLoading(false);
      } catch (err) {
        console.error("載入班級資料失敗:", err);
        console.error("錯誤詳情:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message || '無法載入班級資料');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId, user]);

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

  // 渲染不同內容基於URL參數
  const renderContent = () => {
    // 查看特定作業
    if (assignmentId && !action) {
      return <AssignmentDetail classId={classId} assignmentId={assignmentId} />;
    }
    
    // 創建新作業
    if (action === 'new' && user.role === 'teacher' && classData.teacher._id === user._id) {
      return <AssignmentForm classId={classId} />;
    }
    
    // 編輯現有作業
    if (assignmentId && action === 'edit' && user.role === 'teacher' && classData.teacher._id === user._id) {
      return <AssignmentForm classId={classId} assignmentId={assignmentId} isEditing={true} />;
    }
    
    // 預設：顯示作業列表
    return (
      <div>
        <div className="class-header">
          <Typography variant="h4" component="h1" gutterBottom>
            {classData.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {classData.description}
          </Typography>
        </div>
        <AssignmentList classId={classId} />
      </div>
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

export default Assignments; 