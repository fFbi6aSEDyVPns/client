import api from '../../services/api';
import { setAlert } from './alert';
import {
  GET_CLASSES,
  GET_CLASS,
  ADD_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  CLASS_ERROR,
  ADD_STUDENT_TO_CLASS,
  REMOVE_STUDENT_FROM_CLASS
} from './types';

// Get all classes
export const getClasses = () => async dispatch => {
  try {
    const res = await api.get('/classes');
    
    dispatch({
      type: GET_CLASSES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get class by ID
export const getClassById = (id) => async dispatch => {
  try {
    const res = await api.get(`/classes/${id}`);
    
    dispatch({
      type: GET_CLASS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update class
export const createClass = (formData, history, edit = false) => async dispatch => {
  try {
    const res = await api.post('/classes', formData);
    
    dispatch({
      type: ADD_CLASS,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Class Updated' : 'Class Created', 'success'));
    
    if (!edit) {
      history.push('/classes');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update class
export const updateClass = (id, formData, history) => async dispatch => {
  try {
    const res = await api.put(`/classes/${id}`, formData);
    
    dispatch({
      type: UPDATE_CLASS,
      payload: res.data
    });

    dispatch(setAlert('Class Updated', 'success'));
    history.push(`/classes/${id}`);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete class
export const deleteClass = id => async dispatch => {
  if (window.confirm('Are you sure you want to delete this class?')) {
    try {
      await api.delete(`/classes/${id}`);
      
      dispatch({
        type: DELETE_CLASS,
        payload: id
      });

      dispatch(setAlert('Class Removed', 'success'));
    } catch (err) {
      dispatch({
        type: CLASS_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Add student to class
export const addStudentToClass = (classId, studentId) => async dispatch => {
  try {
    const res = await api.put(`/classes/${classId}/students/${studentId}`);
    
    dispatch({
      type: ADD_STUDENT_TO_CLASS,
      payload: res.data
    });

    dispatch(setAlert('Student added to class', 'success'));
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove student from class
export const removeStudentFromClass = (classId, studentId) => async dispatch => {
  try {
    const res = await api.delete(`/classes/${classId}/students/${studentId}`);
    
    dispatch({
      type: REMOVE_STUDENT_FROM_CLASS,
      payload: studentId
    });

    dispatch(setAlert('Student removed from class', 'success'));
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};