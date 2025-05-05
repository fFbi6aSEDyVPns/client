import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
          You are not enrolled in this class and cannot view its assignments.
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
    // View a specific assignment
    if (assignmentId && !action) {
      return <AssignmentDetail />;
    }
    
    // Create a new assignment
    if (action === 'new' && isClassTeacher) {
      return <AssignmentForm classId={classId} />;
    }
    
    // Edit an existing assignment
    if (assignmentId && action === 'edit' && isClassTeacher) {
      return <AssignmentForm classId={classId} assignmentId={assignmentId} isEditing={true} />;
    }
    
    // Default: show assignment list
    return (
      <div>
        <div className="class-header">
          <h1>{classData.name}</h1>
          <p>{classData.description}</p>
        </div>
        <AssignmentList classId={classId} />
      </div>
    );
  };

  return (
    <div className="assignments-page">
      <div className="container">
        {renderContent()}
      </div>
    </div>
  );
};

export default Assignments;