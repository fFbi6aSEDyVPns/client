import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassDetails, deleteClass } from '../../redux/actions/classActions';
import { FaEdit, FaTrash, FaArrowLeft, FaUsers, FaBook, FaCalendarAlt } from 'react-icons/fa';
import './ClassDetail.css';

const ClassDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classDetail, loading, error } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    dispatch(fetchClassDetails(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this class?？')) {
      dispatch(deleteClass(id));
      navigate('/classes');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!classDetail) return <div className="loading">Can not find class data</div>;

  const isTeacher = user && user.role === 'teacher' && user._id === classDetail.teacher._id;

  return (
    <div className="class-detail-container">
      <div className="class-detail-header">
        <div className="header-left">
          <Link to="/classes" className="back-link">
            <FaArrowLeft /> Return to class list
          </Link>
          <h1>{classDetail.name}</h1>
          <span className="class-code">Class ID: {classDetail.classCode}</span>
        </div>
        {isTeacher && (
          <div className="header-actions">
            <Link to={`/classes/${id}/manage-students`} className="btn-secondary">
              <FaUsers />  Manage students
            </Link>
            <Link to={`/classes/edit/${id}`} className="btn-secondary">
              <FaEdit /> Edit class
            </Link>
            <button onClick={handleDelete} className="btn-danger">
              <FaTrash /> Delete class
            </button>
          </div>
        )}
      </div>

      <div className="class-detail-nav">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Class Info
        </button>
        <button
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Student List
        </button>
        <button
          className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Homework
        </button>
        <button
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Timetable
        </button>
      </div>

      <div className="class-detail-content">
        {activeTab === 'info' && (
          <div className="info-tab">
            <div className="info-card">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Subject</span>
                  <span className="info-value">{classDetail.subject}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Grade</span>
                  <span className="info-value">{classDetail.grade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Semester</span>
                  <span className="info-value">{classDetail.semester}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teacher</span>
                  <span className="info-value">{classDetail.teacher?.name || 'Unasigned'}</span>
                </div>
              </div>
            </div>
            {classDetail.description && (
              <div className="info-card">
                <h3>Class discription</h3>
                <p className="class-description">{classDetail.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-tab">
            <div className="students-header">
              <h3>Student list</h3>
              <div className="student-count">
                {classDetail.students?.length || 0} students in total.
              </div>
            </div>
            {classDetail.students?.length > 0 ? (
              <div className="students-list">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Enrollment Number</th>
                      <th>Email</th>
                      <th>Join date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classDetail.students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.studentId || 'Unassigned'}</td>
                        <td>{student.email}</td>
                        <td>{new Date(student.joinedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">No students in this class yet</div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-tab">
            <div className="assignments-header">
              <h3>Homework list</h3>
              {isTeacher && (
                <Link to={`/classes/${id}/assignments/create`} className="btn-primary">
                  <FaBook /> Create new homework
                </Link>
              )}
            </div>
            {classDetail.assignments?.length > 0 ? (
              <div className="assignments-list">
                {classDetail.assignments.map((assignment) => (
                  <div key={assignment._id} className="assignment-card">
                    <div className="assignment-card-header">
                      <h4>{assignment.title}</h4>
                      <span className={`status ${assignment.status}`}>{assignment.status}</span>
                    </div>
                    <div className="assignment-card-body">
                      <p>{assignment.description}</p>
                      <div className="assignment-dates">
                        <div className="date-item">
                          <span className="date-label">Publish date:</span>
                          <span className="date-value">
                            {new Date(assignment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">Due Date:</span>
                          <span className="date-value">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="assignment-card-footer">
                      <Link to={`/classes/${id}/assignments/${assignment._id}`} className="btn-view">
                      View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No assignments yet</div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-tab">
            <div className="schedule-header">
              <h3>Timetable</h3>
              {isTeacher && (
                <Link to={`/classes/${id}/schedule/edit`} className="btn-primary">
                  <FaCalendarAlt /> Edit timetable
                </Link>
              )}
            </div>
            {classDetail.schedule?.length > 0 ? (
              <div className="schedule-grid">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Start time</th>
                      <th>End time</th>
                      <th>Classroom</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classDetail.schedule.map((session, index) => (
                      <tr key={index}>
                        <td>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][session.dayOfWeek]}</td>
                        <td>{session.startTime}</td>
                        <td>{session.endTime}</td>
                        <td>{session.classroom}</td>
                        <td>{session.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">Timetable not set yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetail;