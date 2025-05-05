import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getScheduleByClass } from '../../services/scheduleService';
import Spinner from '../common/Spinner';
import moment from 'moment';

const ScheduleList = ({ classId }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user && user.role === 'teacher';

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await getScheduleByClass(classId);
        
        // Sort schedule items by date
        const sortedItems = data.sort((a, b) => 
          new Date(a.startTime) - new Date(b.startTime)
        );
        
        setScheduleItems(sortedItems);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load schedule:", err);
        setError('Failed to load schedule');
        setLoading(false);
      }
    };

    loadSchedule();
  }, [classId]);

  // Group schedule items by day
  const groupedByDay = scheduleItems.reduce((groups, item) => {
    const date = moment(item.startTime).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Class Schedule</h2>
        {isTeacher && (
          <Link to={`/classes/${classId}/schedule/new`} className="btn btn-primary">
            Add Schedule Item
          </Link>
        )}
      </div>

      {Object.keys(groupedByDay).length === 0 ? (
        <div className="schedule-empty">
          <p>No schedule items yet</p>
        </div>
      ) : (
        Object.entries(groupedByDay).map(([date, items]) => (
          <div key={date} className="schedule-day">
            <h3 className="day-header">{moment(date).format('dddd, MMMM D, YYYY')}</h3>
            <div className="schedule-items">
              {items.map(item => (
                <div key={item._id} className="schedule-item">
                  <div className="schedule-time">
                    {moment(item.startTime).format('h:mm a')} - {moment(item.endTime).format('h:mm a')}
                  </div>
                  <div className="schedule-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    {item.location && (
                      <div className="schedule-location">
                        <i className="fas fa-map-marker-alt"></i> {item.location}
                      </div>
                    )}
                  </div>
                  {isTeacher && (
                    <div className="schedule-actions">
                      <Link to={`/classes/${classId}/schedule/${item._id}/edit`} className="btn btn-sm btn-outline-primary">
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleList;