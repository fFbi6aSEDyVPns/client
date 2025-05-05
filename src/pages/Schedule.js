import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduleList from '../components/schedule/ScheduleList';
import ScheduleForm from '../components/schedule/ScheduleForm';
import { getClass } from '../services/classService';
import Spinner from '../components/common/Spinner';

const Schedule = () => {
  const { classId, scheduleId, action } = useParams();
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
          You are not enrolled in this class and cannot view its schedule.
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
    // Create a new schedule item
    if (action === 'new' && isClassTeacher) {
      return <ScheduleForm />;
    }
    
    // Edit an existing schedule item
    if (scheduleId && action === 'edit' && isClassTeacher) {
      return <ScheduleForm />;
    }
    
    // Default: show schedule list
    return (
      <div>
        <div className="class-header">
          <h1>{classData.name}</h1>
          <p>{classData.description}</p>
        </div>
        <ScheduleList classId={classId} />
      </div>
    );
  };

  return (
    <div className="schedule-page">
      <div className="container">
        {renderContent()}
      </div>
    </div>
  );
};

export default Schedule;