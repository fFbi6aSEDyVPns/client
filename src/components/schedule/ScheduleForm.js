import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createScheduleItem, getScheduleItem, updateScheduleItem } from '../../services/scheduleService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from '../common/Spinner';

const ScheduleForm = () => {
  const { classId, scheduleId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!scheduleId;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    location: '',
    classId: classId
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScheduleItem = async () => {
      if (isEditing) {
        try {
          const item = await getScheduleItem(scheduleId);
          setFormData({
            ...item,
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime)
          });
        } catch (err) {
          setError('Failed to load schedule item');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchScheduleItem();
  }, [scheduleId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStartTimeChange = (date) => {
    setFormData({
      ...formData,
      startTime: date
    });
  };

  const handleEndTimeChange = (date) => {
    setFormData({
      ...formData,
      endTime: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('End time must be after start time');
      setSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateScheduleItem(scheduleId, formData);
      } else {
        await createScheduleItem(formData);
      }
      navigate(`/classes/${classId}`);
    } catch (err) {
      setError('Failed to save schedule item');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="schedule-form-container">
      <h2>{isEditing ? 'Edit Schedule Item' : 'Add Schedule Item'}</h2>
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
            className="form-control"
            rows="3"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="startTime">Start Time</label>
            <DatePicker
              selected={formData.startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="endTime">End Time</label>
            <DatePicker
              selected={formData.endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              required
              minDate={formData.startTime}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
            placeholder="Room number, Zoom link, etc."
          />
        </div>

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
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Schedule' : 'Add to Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;