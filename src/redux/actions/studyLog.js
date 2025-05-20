import api from '../../utils/api';
import { setAlert } from './alert';
import {
  GET_STUDY_LOGS,
  GET_STUDY_LOG,
  CREATE_STUDY_LOG,
  UPDATE_STUDY_LOG,
  DELETE_STUDY_LOG,
  STUDY_LOG_ERROR,
  CLEAR_STUDY_LOG
} from './types';

// 獲取所有學習記錄
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
      payload: err.response?.data?.message || '獲取學習記錄失敗'
    });
  }
};

// 獲取單個學習記錄
export const getStudyLog = id => async dispatch => {
  try {
    const res = await api.get(`/study-logs/${id}`);
    dispatch({
      type: GET_STUDY_LOG,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STUDY_LOG_ERROR,
      payload: err.response?.data?.message || '獲取學習記錄失敗'
    });
  }
};

// 創建學習記錄
export const createStudyLog = formData => async dispatch => {
  try {
    const res = await api.post('/study-logs', formData);
    dispatch({
      type: CREATE_STUDY_LOG,
      payload: res.data
    });
    dispatch(setAlert('學習記錄已創建', 'success'));
  } catch (err) {
    dispatch({
      type: STUDY_LOG_ERROR,
      payload: err.response?.data?.message || '創建學習記錄失敗'
    });
    dispatch(setAlert(err.response?.data?.message || '創建學習記錄失敗', 'error'));
  }
};

// 更新學習記錄
export const updateStudyLog = (id, formData) => async dispatch => {
  try {
    const res = await api.put(`/study-logs/${id}`, formData);
    dispatch({
      type: UPDATE_STUDY_LOG,
      payload: res.data
    });
    dispatch(setAlert('學習記錄已更新', 'success'));
  } catch (err) {
    dispatch({
      type: STUDY_LOG_ERROR,
      payload: err.response?.data?.message || '更新學習記錄失敗'
    });
    dispatch(setAlert(err.response?.data?.message || '更新學習記錄失敗', 'error'));
  }
};

// 刪除學習記錄
export const deleteStudyLog = id => async dispatch => {
  try {
    await api.delete(`/study-logs/${id}`);
    dispatch({
      type: DELETE_STUDY_LOG,
      payload: id
    });
    dispatch(setAlert('學習記錄已刪除', 'success'));
  } catch (err) {
    dispatch({
      type: STUDY_LOG_ERROR,
      payload: err.response?.data?.message || '刪除學習記錄失敗'
    });
    dispatch(setAlert(err.response?.data?.message || '刪除學習記錄失敗', 'error'));
  }
};

// 清除學習記錄
export const clearStudyLog = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_LOG });
};