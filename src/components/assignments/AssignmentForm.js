import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment, updateAssignment } from '../../services/assignmentService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AssignmentForm = ({ classId, assignment = null, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate ? new Date(assignment.dueDate) : new Date(),
    pointsPossible: assignment?.pointsPossible || 100,
    attachments: assignment?.attachments || []
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date
    });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dueDate', formData.dueDate.toISOString());
    formDataToSend.append('pointsPossible', formData.pointsPossible);
    formDataToSend.append('classId', classId);

    files.forEach(file => {
      formDataToSend.append('files', file);
    });

    try {
      if (isEditing) {
        await updateAssignment(assignment._id, formDataToSend);
      } else {
        await createAssignment(formDataToSend);
      }
      navigate(`/classes/${classId}`);
    } catch (err) {
      setError('Failed to save assignment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-form-container">
      <h2>{isEditing ? 'Edit Assignment' : 'Create New Assignment'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
            className="form-control"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <DatePicker
            selected={formData.dueDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pointsPossible">Points Possible</label>
          <input
            type="number"
            id="pointsPossible"
            name="pointsPossible"
            value={formData.pointsPossible}
            onChange={handleChange}
            min="0"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="files">Attachments</label>
          <input
            type="file"
            id="files"
            name="files"
            onChange={handleFileChange}
            multiple
            className="form-control"
          />
        </div>

        {isEditing && formData.attachments.length > 0 && (
          <div className="form-group">
            <label>Current Attachments</label>
            <ul className="attachment-list">
              {formData.attachments.map((attachment, index) => (
                <li key={index}>
                  <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                    {attachment.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-buttons">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate(`/classes/${classId}`)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Assignment' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;