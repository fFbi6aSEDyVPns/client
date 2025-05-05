import api from '../../services/api';
import { setAlert } from './alert';
import {
  GET_SCHEDULES,
  GET_SCHEDULE,
  ADD_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  SCHEDULE_ERROR
} from './types';

// Get all schedules
export const getSchedules = () => async dispatch => {
  try {
    const res = await api.get('/schedules');
    
    dispatch({
      type: GET_SCHEDULES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get schedule by ID
export const getScheduleById = (id) => async dispatch => {
  try {
    const res = await api.get(`/schedules/${id}`);
    
    dispatch({
      type: GET_SCHEDULE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create schedule
export const createSchedule = (formData, history) => async dispatch => {
  try {
    const res = await api.post('/schedules', formData);
    
    dispatch({
      type: ADD_SCHEDULE,
      payload: res.data
    });

    dispatch(setAlert('Schedule Created', 'success'));
    history.push('/schedules');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update schedule
export const updateSchedule = (id, formData, history) => async dispatch => {
  try {
    const res = await api.put(`/schedules/${id}`, formData);
    
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data
    });

    dispatch(setAlert('Schedule Updated', 'success'));
    history.push('/schedules');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete schedule
export const deleteSchedule = id => async dispatch => {
  if (window.confirm('Are you sure you want to delete this schedule?')) {
    try {
      await api.delete(`/schedules/${id}`);
      
      dispatch({
        type: DELETE_SCHEDULE,
        payload: id
      });

      dispatch(setAlert('Schedule Removed', 'success'));
    } catch (err) {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};