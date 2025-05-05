import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StudyLogList from '../components/study-logs/StudyLogList';
import StudyLogForm from '../components/study-logs/StudyLogForm';
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
        const data = await getClass(classId);
        setClassData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load class:", err);
        setError('Failed to load class information');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!classData) {
    return <div className="alert alert-warning">Class not found</div>;
  }

  // Check if user is enrolled in this class or is a teacher
  const isTeacher = user.role === 'teacher';
  const isEnrolled = classData.students.some(student => student._id === user._id);
  const isClassTeacher = isTeacher && classData.teacher._id === user._id;

  if (!isEnrolled && !isClassTeacher) {
    return (
      <div className="not-enrolled-message">
        <div className="alert alert-warning">
          You are not enrolled in this class and cannot view or log study hours.
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Render different components based on URL parameters
  const renderContent = () => {
    // Create a new study log
    if (action === 'new') {
      return <StudyLogForm />;
    }
    
    // Edit an existing study log
    if (logId && action === 'edit') {
      return <StudyLogForm />;
    }
    
    // Default: show study log list
    return (
      <div>
        <div className="class-header">
          <h1>{classData.name}</h1>
          <p>{classData.description}</p>
        </div>
        <StudyLogList classId={classId} />
      </div>
    );
  };

  return (
    <div className="study-logs-page">
      <div className="container">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudyLogs;