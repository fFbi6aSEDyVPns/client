import api from '../../services/api';
import { setAlert } from './alert';
import {
  GET_STUDY_LOGS,
  GET_STUDY_LOG,
  ADD_STUDY_LOG,
  UPDATE_STUDY_LOG,
  DELETE_STUDY_LOG,
  STUDY_LOG_ERROR
} from './types';

// Get all study logs
export const getStudyLogs = () => async dispatch => {
  try {
    const res = await api.get('/study-logs');
    
    dispatch({
      type: GET_STUDY_LOGS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STUDY_LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get study log by ID
export const getStudyLogById = (id) => async dispatch => {
  try {
    const res = await api.get(`/study-logs/${id}`);
    
    dispatch({
      type: GET_STUDY_LOG,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STUDY_LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create study log
export const createStudyLog = (formData, history) => async dispatch => {
  try {
    const res = await api.post('/study-logs', formData);
    
    dispatch({
      type: ADD_STUDY_LOG,
      payload: res.data
    });

    dispatch(setAlert('Study Log Created', 'success'));
    history.push('/study-logs');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STUDY_LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update study log
export const updateStudyLog = (id, formData, history) => async dispatch => {
  try {
    const res = await api.put(`/study-logs/${id}`, formData);
    
    dispatch({
      type: UPDATE_STUDY_LOG,
      payload: res.data
    });

    dispatch(setAlert('Study Log Updated', 'success'));
    history.push('/study-logs');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STUDY_LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete study log
export const deleteStudyLog = id => async dispatch => {
  if (window.confirm('Are you sure you want to delete this study log?')) {
    try {
      await api.delete(`/study-logs/${id}`);
      
      dispatch({
        type: DELETE_STUDY_LOG,
        payload: id
      });

      dispatch(setAlert('Study Log Removed', 'success'));
    } catch (err) {
      dispatch({
        type: STUDY_LOG_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};