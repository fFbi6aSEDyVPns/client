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
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    // 標題驗證
    if (!formData.title.trim()) {
      newErrors.title = '請輸入標題';
    } else if (formData.title.length < 3) {
      newErrors.title = '標題至少需要3個字符';
    }

    // 開始時間驗證
    if (!formData.startTime) {
      newErrors.startTime = '請選擇開始時間';
    } else if (startTime < now) {
      newErrors.startTime = '開始時間不能是過去的時間';
    }

    // 結束時間驗證
    if (!formData.endTime) {
      newErrors.endTime = '請選擇結束時間';
    } else if (endTime <= startTime) {
      newErrors.endTime = '結束時間必須在開始時間之後';
    }

    // 時間範圍驗證
    const timeDiff = endTime - startTime;
    const maxDuration = 24 * 60 * 60 * 1000; // 24小時
    if (timeDiff > maxDuration) {
      newErrors.endTime = '時間範圍不能超過24小時';
    }

    // 地點驗證
    if (!formData.location.trim()) {
      newErrors.location = '請輸入地點';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除對應的錯誤訊息
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleStartTimeChange = (date) => {
    setFormData({
      ...formData,
      startTime: date
    });
    
    // 如果結束時間在開始時間之前，自動調整結束時間
    if (date > new Date(formData.endTime)) {
      setFormData(prev => ({
        ...prev,
        endTime: new Date(date.getTime() + 60 * 60 * 1000) // 預設1小時後
      }));
    }
    
    // 清除錯誤訊息
    if (errors.startTime) {
      setErrors({ ...errors, startTime: '' });
    }
  };

  const handleEndTimeChange = (date) => {
    setFormData({
      ...formData,
      endTime: date
    });
    
    // 清除錯誤訊息
    if (errors.endTime) {
      setErrors({ ...errors, endTime: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!validateForm()) {
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
      setError('儲存排程項目失敗');
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
      <h2>{isEditing ? '編輯排程項目' : '新增排程項目'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">標題 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">描述</label>
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
            <label htmlFor="startTime">開始時間 *</label>
            <DatePicker
              selected={formData.startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
              required
              minDate={new Date()}
            />
            {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="endTime">結束時間 *</label>
            <DatePicker
              selected={formData.endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
              required
              minDate={formData.startTime}
            />
            {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">地點 *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            required
            placeholder="教室號碼、Zoom連結等"
          />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/classes/${classId}`)}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? '儲存中...' : isEditing ? '更新排程' : '新增排程'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;