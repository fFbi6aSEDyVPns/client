import {
    GET_ASSIGNMENTS,
    GET_ASSIGNMENT,
    ADD_ASSIGNMENT,
    UPDATE_ASSIGNMENT,
    DELETE_ASSIGNMENT,
    ASSIGNMENT_ERROR,
    CLEAR_ASSIGNMENT
  } from './types';
  import { getAssignmentsByClass, getAssignment, createAssignment, updateAssignment, deleteAssignment } from '../../services/assignmentService';
  
  // Get assignments for a class
  export const getAssignments = (classId) => async (dispatch) => {
    try {
      const res = await getAssignmentsByClass(classId);
      
      dispatch({
        type: GET_ASSIGNMENTS,
        payload: res
      });
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || 'Failed to fetch assignments'
      });
    }
  };
  
  // Get single assignment
  export const getSingleAssignment = (id) => async (dispatch) => {
    try {
      const res = await getAssignment(id);
      
      dispatch({
        type: GET_ASSIGNMENT,
        payload: res
      });
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || 'Failed to fetch assignment'
      });
    }
  };
  
  // Add assignment
  export const addAssignment = (formData) => async (dispatch) => {
    try {
      const res = await createAssignment(formData);
      
      dispatch({
        type: ADD_ASSIGNMENT,
        payload: res
      });
      
      return res;
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || 'Failed to create assignment'
      });
      
      throw err;
    }
  };
  
  // Update assignment
  export const editAssignment = (id, formData) => async (dispatch) => {
    try {
      const res = await updateAssignment(id, formData);
      
      dispatch({
        type: UPDATE_ASSIGNMENT,
        payload: res
      });
      
      return res;
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || 'Failed to update assignment'
      });
      
      throw err;
    }
  };
  
  // Delete assignment
  export const removeAssignment = (id) => async (dispatch) => {
    try {
      await deleteAssignment(id);
      
      dispatch({
        type: DELETE_ASSIGNMENT,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: ASSIGNMENT_ERROR,
        payload: err.response?.data?.msg || 'Failed to delete assignment'
      });
      
      throw err;
    }
  };
  
  // Clear current assignment
  export const clearAssignment = () => (dispatch) => {
    dispatch({ type: CLEAR_ASSIGNMENT });
  };