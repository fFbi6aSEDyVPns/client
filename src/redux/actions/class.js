import api from '../../services/api';
import { setAlert } from './alert';
import {
  GET_CLASSES,
  GET_CLASS,
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  CLASS_ERROR,
  CLEAR_CLASS,
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
      payload: err.response?.data?.msg || '無法獲取班級列表'
    });
  }
};

// Get class by ID
export const getClass = (id) => async dispatch => {
  try {
    const res = await api.get(`/classes/${id}`);
    
    dispatch({
      type: GET_CLASS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '無法獲取班級詳情'
    });
  }
};

// Create or update class
export const createClass = (formData) => async dispatch => {
  try {
    const res = await api.post('/classes', formData);
    
    dispatch({
      type: CREATE_CLASS,
      payload: res.data
    });
    
    dispatch(setAlert('班級創建成功', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '創建班級失敗'
    });
    throw err;
  }
};

// Update class
export const updateClass = (id, formData) => async dispatch => {
  try {
    const res = await api.put(`/classes/${id}`, formData);
    
    dispatch({
      type: UPDATE_CLASS,
      payload: res.data
    });
    
    dispatch(setAlert('班級更新成功', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '更新班級失敗'
    });
    throw err;
  }
};

// Delete class
export const deleteClass = (id) => async dispatch => {
  try {
    await api.delete(`/classes/${id}`);
    
    dispatch({
      type: DELETE_CLASS,
      payload: id
    });
    
    dispatch(setAlert('班級已刪除', 'success'));
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '刪除班級失敗'
    });
    throw err;
  }
};

// Add student to class
export const addStudentToClass = (classId, { students }) => async dispatch => {
  try {
    const res = await api.post(`/classes/${classId}/students`, { students });
    
    dispatch({
      type: ADD_STUDENT_TO_CLASS,
      payload: res.data
    });
    
    dispatch(setAlert('學生已添加到班級', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '添加學生失敗'
    });
    throw err;
  }
};

// Remove student from class
export const removeStudentFromClass = (classId, { students }) => async dispatch => {
  try {
    const res = await api.delete(`/classes/${classId}/students`, { data: { students } });
    
    dispatch({
      type: REMOVE_STUDENT_FROM_CLASS,
      payload: res.data
    });
    
    dispatch(setAlert('學生已從班級移除', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '移除學生失敗'
    });
    throw err;
  }
};

// Clear current class
export const clearClass = () => (dispatch) => {
  dispatch({ type: CLEAR_CLASS });
};

// 學生加入班級
export const joinClass = (classCode) => async (dispatch) => {
  try {
    const res = await api.post(`/classes/join/${classCode}`);
    
    dispatch({
      type: ADD_STUDENT_TO_CLASS,
      payload: res.data
    });
    
    dispatch(setAlert('成功加入班級', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '加入班級失敗'
    });
    dispatch(setAlert(err.response?.data?.msg || '加入班級失敗', 'error'));
    throw err;
  }
};