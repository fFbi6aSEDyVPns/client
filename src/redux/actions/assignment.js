import {
    GET_ASSIGNMENTS,
    GET_ASSIGNMENT,
    CREATE_ASSIGNMENT,
    UPDATE_ASSIGNMENT,
    DELETE_ASSIGNMENT,
    ASSIGNMENT_ERROR,
    CLEAR_ASSIGNMENT,
    SUBMIT_ASSIGNMENT,
    GRADE_ASSIGNMENT
  } from './types';
  import { setAlert } from './alert';
  import api from '../../utils/api';
  
  // Get assignments for a class
  export const getAssignments = (classId) => async (dispatch) => {
    try {
      const res = await api.get(`/assignments/class/${classId}`);
      
      dispatch({
        type: GET_ASSIGNMENTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '無法獲取作業列表'
      });
    }
  };
  
  // Get single assignment
  export const getAssignment = (id) => async (dispatch) => {
    try {
      const res = await api.get(`/assignments/${id}`);
      
      dispatch({
        type: GET_ASSIGNMENT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '無法獲取作業詳情'
      });
    }
  };
  
  // Add assignment
  export const addAssignment = (formData) => async (dispatch) => {
    try {
      const res = await api.post('/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: CREATE_ASSIGNMENT,
        payload: res.data
      });
      
      dispatch(setAlert('作業創建成功', 'success'));
      return res.data;
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '創建作業失敗'
      });
      
      throw err;
    }
  };
  
  // Update assignment
  export const editAssignment = (id, formData) => async (dispatch) => {
    try {
      const res = await api.put(`/assignments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: UPDATE_ASSIGNMENT,
        payload: res.data
      });
      
      dispatch(setAlert('作業更新成功', 'success'));
      return res.data;
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '更新作業失敗'
      });
      
      throw err;
    }
  };
  
  // Delete assignment
  export const deleteAssignment = (id) => async (dispatch) => {
    try {
      await api.delete(`/assignments/${id}`);
      
      dispatch({
        type: DELETE_ASSIGNMENT,
        payload: id
      });
      
      dispatch(setAlert('作業已刪除', 'success'));
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '刪除作業失敗'
      });
      
      throw err;
    }
  };
  
  // Submit assignment
  export const submitAssignment = (assignmentId, formData) => async (dispatch) => {
    try {
      const res = await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: SUBMIT_ASSIGNMENT,
        payload: res.data
      });
      
      dispatch(setAlert('作業提交成功', 'success'));
      return res.data;
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '提交作業失敗'
      });
      throw err;
    }
  };
  
  // Grade assignment
  export const gradeAssignment = (assignmentId, { grade, feedback }) => async (dispatch) => {
    try {
      const res = await api.post(`/assignments/${assignmentId}/grade`, { grade, feedback });
      
      dispatch({
        type: GRADE_ASSIGNMENT,
        payload: res.data
      });
      
      dispatch(setAlert('評分成功', 'success'));
      return res.data;
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || '評分失敗'
      });
      throw err;
    }
  };
  
  // Clear current assignment
  export const clearAssignment = () => (dispatch) => {
    dispatch({ type: CLEAR_ASSIGNMENT });
  };