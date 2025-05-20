import {
  GET_SCHEDULES,
  GET_SCHEDULE,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  DELETE_SCHEDULE_ITEM,
  SCHEDULE_ERROR,
  CLEAR_SCHEDULE,
  ADD_SCHEDULE
} from './types';
import { setAlert } from './alert';
import api from '../../utils/api';

// 獲取所有課程表
export const getSchedules = (classId) => async (dispatch) => {
  try {
    const res = await api.get(`/schedules/class/${classId}`);
    
    dispatch({
      type: GET_SCHEDULES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.msg || '無法獲取課程表'
    });
  }
};

// 獲取單個課程表
export const getSchedule = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/schedules/${id}`);
    
    dispatch({
      type: GET_SCHEDULE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.msg || '無法獲取課程表詳情'
    });
  }
};

// 創建課程表
export const createSchedule = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/schedules', formData);
    
    dispatch({
      type: CREATE_SCHEDULE,
      payload: res.data
    });
    
    dispatch(setAlert('課程表創建成功', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.msg || '創建課程表失敗'
    });
    throw err;
  }
};

// 更新課程表
export const updateSchedule = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/schedules/${id}`, formData);
    
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data
    });
    
    dispatch(setAlert('課程表更新成功', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.msg || '更新課程表失敗'
    });
    throw err;
  }
};

// 刪除課程表
export const deleteSchedule = (id) => async (dispatch) => {
  try {
    await api.delete(`/schedules/${id}`);
    
    dispatch({
      type: DELETE_SCHEDULE,
      payload: id
    });
    
    dispatch(setAlert('課程表已刪除', 'success'));
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.msg || '刪除課程表失敗'
    });
    throw err;
  }
};

// 刪除課程表項目
export const deleteScheduleItem = (scheduleId, itemId) => async (dispatch) => {
  try {
    const res = await api.delete(`/schedules/${scheduleId}/items/${itemId}`);
    
    dispatch({
      type: DELETE_SCHEDULE_ITEM,
      payload: res.data
    });
    
    dispatch(setAlert('課程表項目已刪除', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.msg || '刪除課程表項目失敗'
    });
    throw err;
  }
};

// 清除當前課程表
export const clearSchedule = () => (dispatch) => {
  dispatch({ type: CLEAR_SCHEDULE });
};