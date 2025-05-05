import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchClassDetails, 
  addStudentToClass, 
  removeStudentFromClass 
} from '../../redux/actions/classActions';
import { fetchStudents } from '../../redux/actions/userActions';
import { FaArrowLeft, FaSearch, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import './ManageStudents.css';

const ManageStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { classDetail, loading: classLoading, error: classError } = useSelector((state) => state.classes);
  const { students, loading: studentsLoading, error: studentsError } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [tab, setTab] = useState('enrolled');
  
  useEffect(() => {
    dispatch(fetchClassDetails(id));
    dispatch(fetchStudents());
  }, [dispatch, id]);
  
  // Redirect if user is not a teacher or not the teacher of this class
  useEffect(() => {
    if (classDetail && user && (user.role !== 'teacher' || user._id !== classDetail.teacher._id)) {
      navigate(`/classes/${id}`);
    }
  }, [classDetail, user, navigate, id]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  
  const handleAddStudents = () => {
    if (selectedStudents.length > 0) {
      dispatch(addStudentToClass(id, { students: selectedStudents }));
      setSelectedStudents([]);
    }
  };
  
  const handleRemoveStudents = () => {
    if (selectedStudents.length > 0) {
      dispatch(removeStudentFromClass(id, { students: selectedStudents }));
      setSelectedStudents([]);
    }
  };
  
  // Get enrolled students
  const enrolledStudents = classDetail?.students || [];
  
  // Get available students (not enrolled in this class)
  const availableStudents = students.filter(
    student => 
      student.role === 'student' && 
      !enrolledStudents.some(enrolledStudent => enrolledStudent._id === student._id)
  );
  
  // Filter students based on search term
  const filterStudents = (studentList) => {
    return studentList.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredEnrolledStudents = filterStudents(enrolledStudents);
  const filteredAvailableStudents = filterStudents(availableStudents);
  
  if (classLoading || studentsLoading) return <div className="loading">Loading...</div>;
  if (classError || studentsError) return <div className="error-message">{classError || studentsError}</div>;
  if (!classDetail) return <div className="loading">Can not find class detail</div>;
  
  return (
    <div className="manage-students-container">
      <div className="manage-header">
        <Link to={`/classes/${id}`} className="back-link">
          <FaArrowLeft /> Return
        </Link>
        <h1>Manage student - {classDetail.name}</h1>
      </div>
      
      <div className="manage-tabs">
        <button 
          className={`tab-button ${tab === 'enrolled' ? 'active' : ''}`}
          onClick={() => setTab('enrolled')}
        >
          Student ({enrolledStudents.length}) has been added
        </button>
        <button 
          className={`tab-button ${tab === 'available' ? 'active' : ''}`}
          onClick={() => setTab('available')}
        >
          Available student ({availableStudents.length})
        </button>
      </div>
      
      <div className="manage-content">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search student name, email, or enrollment number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        {tab === 'enrolled' && (
          <>
            {selectedStudents.length > 0 && (
              <div className="action-bar">
                <button onClick={handleRemoveStudents} className="btn-remove">
                  <FaUserMinus /> Remove selected student ({selectedStudents.length})
                </button>
              </div>
            )}
            
            {filteredEnrolledStudents.length === 0 ? (
              <div className="no-students">
                {searchTerm ? "No students found matching the criteria" : "This class has no students yet"}
              </div>
            ) : (
              <div className="students-table">
                <table>
                  <thead>
                    <tr>
                      <th className="checkbox-col">
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents(filteredEnrolledStudents.map(s => s._id));
                            } else {
                              setSelectedStudents([]);
                            }
                          }}
                          checked={
                            filteredEnrolledStudents.length > 0 && 
                            selectedStudents.length === filteredEnrolledStudents.length
                          }
                        />
                      </th>
                      <th>Name</th>
                      <th>Enrollment number</th>
                      <th>Email</th>
                      <th>Join date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrolledStudents.map(student => (
                      <tr key={student._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                          />
                        </td>
                        <td>{student.name}</td>
                        <td>{student.studentId || 'Unasigned'}</td>
                        <td>{student.email}</td>
                        <td>{new Date(student.joinedAt || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {tab === 'available' && (
          <>
            {selectedStudents.length > 0 && (
              <div className="action-bar">
                <button onClick={handleAddStudents} className="btn-add">
                  <FaUserPlus /> Add selected student ({selectedStudents.length})
                </button>
              </div>
            )}
            
            {filteredAvailableStudents.length === 0 ? (
              <div className="no-students">
                {searchTerm ? "No students found matching the criteria" : "No avalible students"}
              </div>
            ) : (
              <div className="students-table">
                <table>
                  <thead>
                    <tr>
                      <th className="checkbox-col">
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents(filteredAvailableStudents.map(s => s._id));
                            } else {
                              setSelectedStudents([]);
                            }
                          }}
                          checked={
                            filteredAvailableStudents.length > 0 && 
                            selectedStudents.length === filteredAvailableStudents.length
                          }
                        />
                      </th>
                      <th>Name</th>
                      <th>Enrollment number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAvailableStudents.map(student => (
                      <tr key={student._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                          />
                        </td>
                        <td>{student.name}</td>
                        <td>{student.studentId || 'Unasigned'}</td>
                        <td>{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;