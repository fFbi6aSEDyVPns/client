import axios from 'axios';
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
  REMOVE_STUDENT_FROM_CLASS,
  SET_LOADING,
  CLEAR_CLASS_ERROR
} from './types';

/**
 * Get all classes
 */
export const getClasses = () => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const res = await axios.get('/api/classes');
    console.log('getClasses response:', res.data); // 添加日誌
    
    // 確保返回的數據結構正確
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      dispatch({
        type: GET_CLASSES,
        payload: res.data
      });
    } else {
      console.error('getClasses - invalid data structure:', res.data);
      dispatch({
        type: CLASS_ERROR,
        payload: '獲取班級列表失敗：數據格式錯誤'
      });
    }
  } catch (err) {
    console.error('getClasses error:', err); // 添加錯誤日誌
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '獲取班級列表失敗'
    });
  }
};

/**
 * Get class by ID
 * @param {string} id - Class ID
 */
export const getClass = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const res = await axios.get(`/api/classes/${id}`);
    dispatch({
      type: GET_CLASS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '獲取班級詳情失敗'
    });
  }
};

/**
 * Create new class
 * @param {object} formData - Class data
 */
export const createClass = (formData) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.post('/api/classes', formData, config);
    console.log('createClass response:', res.data); // 添加日誌
    
    // 只 dispatch getClasses，不要再 dispatch CREATE_CLASS
    await dispatch(getClasses());
    
    dispatch(setAlert('班級創建成功', 'success'));
    return res.data;
  } catch (err) {
    console.error('createClass error:', err); // 添加錯誤日誌
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '創建班級失敗'
    });
    throw err;
  }
};

/**
 * Update class
 * @param {string} id - Class ID
 * @param {object} formData - Updated class data
 */
export const updateClass = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/classes/${id}`, formData, config);
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
    dispatch(setAlert(err.response?.data?.msg || '更新班級失敗', 'error'));
    throw err;
  }
};

/**
 * Delete class
 * @param {string} id - Class ID
 */
export const deleteClass = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    await axios.delete(`/api/classes/${id}`);
    dispatch({
      type: DELETE_CLASS,
      payload: id
    });
    dispatch(setAlert('班級刪除成功', 'success'));
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: err.response?.data?.msg || '刪除班級失敗'
    });
    dispatch(setAlert(err.response?.data?.msg || '刪除班級失敗', 'error'));
  }
};

// Add student to class
export const addStudentToClass = (classId, { students }) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const res = await axios.post(`/api/classes/${classId}/students`, { students });
    dispatch({
      type: ADD_STUDENT_TO_CLASS,
      payload: res.data
    });
    dispatch(setAlert('學生已添加到班級', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response?.data?.msg || '添加學生失敗' }
    });
    dispatch(setAlert(err.response?.data?.msg || '添加學生失敗', 'error'));
    throw err;
  }
};

// Remove student from class
export const removeStudentFromClass = (classId, { students }) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const res = await axios.delete(`/api/classes/${classId}/students`, { data: { students } });
    dispatch({
      type: REMOVE_STUDENT_FROM_CLASS,
      payload: res.data
    });
    dispatch(setAlert('學生已從班級移除', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response?.data?.msg || '移除學生失敗' }
    });
    dispatch(setAlert(err.response?.data?.msg || '移除學生失敗', 'error'));
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
    dispatch({ type: SET_LOADING });
    const res = await axios.post(`/api/classes/join/${classCode}`);
    dispatch({
      type: ADD_STUDENT_TO_CLASS,
      payload: res.data
    });
    dispatch(setAlert('成功加入班級', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response?.data?.msg || '加入班級失敗' }
    });
    dispatch(setAlert(err.response?.data?.msg || '加入班級失敗', 'error'));
    throw err;
  }
};

/**
 * Clear class error
 */
export const clearClassError = () => dispatch => {
  dispatch({ type: CLEAR_CLASS_ERROR });
};