import {
  GET_CLASSES_REQUEST,
  GET_CLASSES_SUCCESS,
  GET_CLASSES_FAIL,
  GET_CLASS_REQUEST,
  GET_CLASS_SUCCESS,
  GET_CLASS_FAIL,
  CLASS_ERROR
} from './types';
import api from '../../services/api';

// 獲取所有班級
export const getClasses = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CLASSES_REQUEST });

    const res = await api.get('/classes');

    dispatch({
      type: GET_CLASSES_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_CLASSES_FAIL,
      payload: err.message
    });
  }
};

// 獲取單個班級
export const getClass = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_CLASS_REQUEST });

    const res = await api.get(`/classes/${id}`);

    dispatch({
      type: GET_CLASS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_CLASS_FAIL,
      payload: err.message
    });
  }
}; 