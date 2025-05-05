import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAssignment, deleteAssignment, submitAssignment, gradeSubmission } from '../../services/assignmentService';
import moment from 'moment';
import Spinner from '../common/Spinner';

const AssignmentDetail = () => {
  const { classId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [grading, setGrading] = useState({});
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user && user.role === 'teacher';

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignment(assignmentId);
        setAssignment(data);
      } catch (err) {
        setError('Failed to load assignment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      await submitAssignment(assignmentId, formData);
      // Refresh assignment data
      const updatedAssignment = await getAssignment(assignmentId);
      setAssignment(updatedAssignment);
      setFiles([]);
    } catch (err) {
      setError('Failed to submit assignment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        navigate(`/classes/${classId}`);
      } catch (err) {
        setError('Failed to delete assignment');
        console.error(err);
      }
    }
  };

  const handleGradeChange = (studentId, value) => {
    setGrading({
      ...grading,
      [studentId]: value
    });
  };

  const submitGrade = async (submissionId, studentId) => {
    try {
      await gradeSubmission(assignmentId, submissionId, { grade: grading[studentId] });
      // Refresh assignment data
      const updatedAssignment = await getAssignment(assignmentId);
      setAssignment(updatedAssignment);
    } catch (err) {
      setError('Failed to submit grade');
      console.error(err);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!assignment) {
    return <div className="alert alert-warning">Assignment not found</div>;
  }

  // Find student's submission if they have one
  const studentSubmission = assignment.submissions.find(
    sub => sub.studentId._id === user._id
  );

  const isPastDue = moment().isAfter(moment(assignment.dueDate));

  return (
    <div className="assignment-detail-container">
      <div className="assignment-header">
        <h2>{assignment.title}</h2>
        <div className="assignment-meta">
          <span className="due-date">Due: {moment(assignment.dueDate).format('MMMM D, YYYY, h:mm a')}</span>
          <span className="points">Points: {assignment.pointsPossible}</span>
        </div>
        {isTeacher && (
          <div className="teacher-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/classes/${classId}/assignments/${assignmentId}/edit`)}
            >
              Edit Assignment
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Assignment
            </button>
          </div>
        )}
      </div>

      <div className="assignment-content">
        <h3>Instructions</h3>
        <div className="assignment-description">
          {assignment.description}
        </div>
      </div>

      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="assignment-attachments">
          <h3>Attachments</h3>
          <ul>
            {assignment.attachments.map((attachment, index) => (
              <li key={index}>
                <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                  {attachment.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isTeacher && (
        <div className="submission-section">
          <h3>Your Submission</h3>
          {studentSubmission ? (
            <div className="submission-info">
              <p>Submitted on: {moment(studentSubmission.submissionDate).format('MMMM D, YYYY, h:mm a')}</p>
              {studentSubmission.grade !== undefined ? (
                <p className="grade">Grade: {studentSubmission.grade} / {assignment.pointsPossible}</p>
              ) : (
                <p>Not yet graded</p>
              )}
              {studentSubmission.files && studentSubmission.files.length > 0 && (
                <div>
                  <h4>Submitted Files</h4>
                  <ul>
                    {studentSubmission.files.map((file, index) => (
                      <li key={index}>
                        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                          {file.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : isPastDue ? (
            <div className="alert alert-danger">
              This assignment is past due and can no longer be submitted.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="submission-form">
              <div className="form-group">
                <label htmlFor="files">Upload Files</label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  required
                  className="form-control"
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting || files.length === 0}
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </form>
          )}
        </div>
      )}

      {isTeacher && (
        <div className="submissions-section">
          <h3>Student Submissions</h3>
          {assignment.submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            <div className="submissions-list">
              {assignment.submissions.map(submission => (
                <div key={submission._id} className="submission-item">
                  <h4>{submission.studentId.firstName} {submission.studentId.lastName}</h4>
                  <p>Submitted: {moment(submission.submissionDate).format('MMMM D, YYYY, h:mm a')}</p>
                  
                  {submission.files && submission.files.length > 0 && (
                    <div>
                      <h5>Files:</h5>
                      <ul>
                        {submission.files.map((file, index) => (
                          <li key={index}>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                              {file.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grading-section">
                    {submission.grade !== undefined ? (
                      <div>
                        <p>Grade: {submission.grade} / {assignment.pointsPossible}</p>
                        <div className="update-grade">
                          <input 
                            type="number" 
                            min="0" 
                            max={assignment.pointsPossible}
                            defaultValue={submission.grade}
                            onChange={(e) => handleGradeChange(submission.studentId._id, e.target.value)}
                            className="form-control grade-input"
                          />
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => submitGrade(submission._id, submission.studentId._id)}
                          >
                            Update Grade
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="assign-grade">
                        <input 
                          type="number"
                          min="0"
                          max={assignment.pointsPossible}
                          placeholder="Points"
                          onChange={(e) => handleGradeChange(submission.studentId._id, e.target.value)}
                          className="form-control grade-input"
                        />
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => submitGrade(submission._id, submission.studentId._id)}
                        >
                          Assign Grade
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;