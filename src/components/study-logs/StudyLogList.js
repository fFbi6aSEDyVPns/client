import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudyLogsByClass, getStudyLogsByStudent } from '../../services/studyLogService';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Spinner from '../common/Spinner';

const StudyLogList = ({ classId }) => {
  const [studyLogs, setStudyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user && user.role === 'teacher';

  useEffect(() => {
    const fetchStudyLogs = async () => {
      try {
        let logs;
        if (isTeacher) {
          logs = await getStudyLogsByClass(classId);
        } else {
          logs = await getStudyLogsByStudent(classId, user._id);
        }
        
        // Sort logs by date (newest first)
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setStudyLogs(logs);
        
        // Calculate total hours
        const total = logs.reduce((sum, log) => sum + log.duration, 0);
        setTotalHours(total);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load study logs:", err);
        setError('Failed to load study logs');
        setLoading(false);
      }
    };

    fetchStudyLogs();
  }, [classId, user._id, isTeacher]);

  // Group logs by date
  const groupedByDate = studyLogs.reduce((groups, log) => {
    const date = moment(log.date).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {});

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="study-logs-container">
      <div className="study-logs-header">
        <h2>Study Logs</h2>
        <div className="study-logs-summary">
          <p>Total Study Time: {totalHours.toFixed(1)} hours</p>
          <Link to={`/classes/${classId}/study-logs/new`} className="btn btn-primary">
            Add Study Log
          </Link>
        </div>
      </div>

      {studyLogs.length === 0 ? (
        <div className="study-logs-empty">
          <p>No study logs recorded yet.</p>
          <p>Start tracking your study time to see your progress!</p>
        </div>
      ) : (
        <div className="study-logs-list">
          {Object.entries(groupedByDate).map(([date, logs]) => (
            <div key={date} className="study-log-day">
              <h3>{moment(date).format('dddd, MMMM D, YYYY')}</h3>
              {logs.map(log => (
                <div key={log._id} className="study-log-item">
                  {isTeacher && (
                    <div className="student-info">
                      <span className="student-name">
                        {log.student.firstName} {log.student.lastName}
                      </span>
                    </div>
                  )}
                  <div className="log-content">
                    <div className="log-topic">
                      <h4>{log.topic}</h4>
                    </div>
                    <div className="log-details">
                      <span className="log-duration">{log.duration} hours</span>
                      <span className="log-time">{moment(log.date).format('h:mm a')}</span>
                    </div>
                    {log.notes && <p className="log-notes">{log.notes}</p>}
                  </div>
                  {!isTeacher && (
                    <div className="log-actions">
                      <Link 
                        to={`/classes/${classId}/study-logs/${log._id}/edit`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyLogList;