import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignmentsByClass } from '../../services/assignmentService';
import Spinner from '../common/Spinner';
import moment from 'moment';

const AssignmentList = ({ classId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user && user.role === 'teacher';

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await getAssignmentsByClass(classId);
        setAssignments(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load assignments:", err);
        setLoading(false);
      }
    };

    loadAssignments();
  }, [classId]);

  if (loading) {
    return <Spinner />;
  }

  if (assignments.length === 0) {
    return (
      <div className="assignments-empty">
        <h3>No assignments yet</h3>
        {isTeacher && (
          <Link to={`/classes/${classId}/assignments/new`} className="btn btn-primary">
            Create Assignment
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h2>Assignments</h2>
        {isTeacher && (
          <Link to={`/classes/${classId}/assignments/new`} className="btn btn-primary">
            Create Assignment
          </Link>
        )}
      </div>
      <div className="assignments-list">
        {assignments.map(assignment => (
          <div key={assignment._id} className="assignment-item">
            <Link to={`/classes/${classId}/assignments/${assignment._id}`}>
              <h3>{assignment.title}</h3>
              <p>{assignment.description.substring(0, 100)}...</p>
              <div className="assignment-meta">
                <span className="due-date">Due: {moment(assignment.dueDate).format('MMMM D, YYYY')}</span>
                <span className="points">Points: {assignment.pointsPossible}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;