import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_CLASSES,
  GET_CLASS,
  CLASS_ERROR,
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS
} from '../types';

// 獲取所有班級
export const getClasses = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/classes');

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

// 獲取單個班級
export const getClass = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/classes/${id}`);

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

// 創建班級
export const createClass = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/classes', formData, config);

    dispatch({
      type: CREATE_CLASS,
      payload: res.data
    });

    dispatch(setAlert('班級創建成功', 'success'));
    navigate('/classes');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// 更新班級
export const updateClass = (id, formData, navigate) => async (dispatch) => {
  try {
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
    navigate('/classes');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// 刪除班級
export const deleteClass = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/classes/${id}`);

    dispatch({
      type: DELETE_CLASS,
      payload: id
    });

    dispatch(setAlert('班級已刪除', 'success'));
  } catch (err) {
    dispatch({
      type: CLASS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}; 