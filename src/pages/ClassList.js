import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses, deleteClass } from '../../redux/actions/classActions';
import { FaEdit, FaTrash, FaPlus, FaUsers } from 'react-icons/fa';
import './ClassList.css';

const ClassList = () => {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除這個班級嗎？')) {
      dispatch(deleteClass(id));
    }
  };

  const filteredClasses = classes.filter(
    (cls) => cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="class-list-container">
      <div className="class-list-header">
        <h1>Class Management</h1>
        <div className="actions-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Searching Class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {user && user.role === 'teacher' && (
            <Link to="/classes/create" className="btn-create">
              <FaPlus /> create new class
            </Link>
          )}
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <div className="no-classes">
          <p>no class record</p>
        </div>
      ) : (
        <div className="class-grid">
          {filteredClasses.map((cls) => (
            <div key={cls._id} className="class-card">
              <div className="class-card-header">
                <h3>{cls.name}</h3>
                <span className="class-code">{cls.classCode}</span>
              </div>
              <div className="class-card-body">
                <p><strong>Subject:</strong> {cls.subject}</p>
                <p><strong>Grade:</strong> {cls.grade}</p>
                <p><strong>Student number:</strong> {cls.students ? cls.students.length : 0}</p>
              </div>
              <div className="class-card-footer">
                <Link to={`/classes/${cls._id}`} className="btn-view">
                  Look detail
                </Link>
                {user && user.role === 'teacher' && user._id === cls.teacher && (
                  <div className="teacher-actions">
                    <Link to={`/classes/${cls._id}/manage-students`} className="btn-icon">
                      <FaUsers />
                    </Link>
                    <Link to={`/classes/edit/${cls._id}`} className="btn-icon">
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="btn-icon delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassList;