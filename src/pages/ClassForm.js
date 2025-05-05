import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createClass, updateClass, fetchClassDetails } from '../../redux/actions/classActions';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import './ClassForm.css';

const ClassForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { classDetail, loading, error } = useSelector((state) => state.classes);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    grade: '',
    semester: '',
    description: '',
    classCode: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchClassDetails(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && classDetail) {
      setFormData({
        name: classDetail.name || '',
        subject: classDetail.subject || '',
        grade: classDetail.grade || '',
        semester: classDetail.semester || '',
        description: classDetail.description || '',
        classCode: classDetail.classCode || ''
      });
    }
  }, [isEditMode, classDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when field is changed
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a class name';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter subject';
    }
    
    if (!formData.grade.trim()) {
      newErrors.grade = 'Please enter grade';
    }
    
    if (!formData.semester.trim()) {
      newErrors.semester = 'Please enter semester';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode) {
      dispatch(updateClass(id, formData, () => navigate(`/classes/${id}`)));
    } else {
      dispatch(createClass({...formData, teacher: user._id}, () => navigate('/classes')));
    }
  };

  // Redirect if user is not a teacher
  if (user && user.role !== 'teacher') {
    return navigate('/classes');
  }

  return (
    <div className="class-form-container">
      <div className="form-header">
        <Link to={isEditMode ? `/classes/${id}` : '/classes'} className="back-link">
          <FaArrowLeft /> {isEditMode ? 'Return to Class Details' : 'Return to Class List'}
        </Link>
        <h1>{isEditMode ? 'Edit class' : 'Create new class'}</h1>
      </div>

      {loading ? (
        <div className="loading">Landing...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="class-form">
          <div className="form-group">
            <label htmlFor="name">Class name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={errors.subject ? 'error' : ''}
              />
              {errors.subject && <div className="error-text">{errors.subject}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="grade">Grade *</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={errors.grade ? 'error' : ''}
              >
                <option value="">Select grade</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
              {errors.grade && <div className="error-text">{errors.grade}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={errors.semester ? 'error' : ''}
              >
                <option value="">Select semester</option>
                <option value="First semester">First semester</option>
                <option value="Second semester">Second semester</option>
                <option value="Summer class">Summer class</option>
                <option value="Winter class">Winter class</option>
              </select>
              {errors.semester && <div className="error-text">{errors.semester}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="classCode">Class ID</label>
            <input
              type="text"
              id="classCode"
              name="classCode"
              value={formData.classCode}
              onChange={handleChange}
              disabled={isEditMode}
              placeholder={!isEditMode ? "Leave blank will auto-generate" : ""}
            />
            {!isEditMode && <div className="hint-text">Leave blank will auto-generate a 6-digit class ID</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Class description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(isEditMode ? `/classes/${id}` : '/classes')} className="btn-cancel">
              cancel
            </button>
            <button type="submit" className="btn-save">
              <FaSave /> {isEditMode ? 'Sve changes' : 'Create class'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClassForm;  // This should be placed here
