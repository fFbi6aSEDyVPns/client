import {
    GET_ASSIGNMENTS,
    GET_ASSIGNMENT,
    ADD_ASSIGNMENT,
    UPDATE_ASSIGNMENT,
    DELETE_ASSIGNMENT,
    ASSIGNMENT_ERROR,
    CLEAR_ASSIGNMENT
  } from '../actions/types';
  
  const initialState = {
    assignments: [],
    assignment: null,
    loading: true,
    error: {}
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_ASSIGNMENTS:
        return {
          ...state,
          assignments: payload,
          loading: false
        };
      case GET_ASSIGNMENT:
        return {
          ...state,
          assignment: payload,
          loading: false
        };
      case ADD_ASSIGNMENT:
        return {
          ...state,
          assignments: [payload, ...state.assignments],
          loading: false
        };
      case UPDATE_ASSIGNMENT:
        return {
          ...state,
          assignments: state.assignments.map(assignment => 
            assignment._id === payload._id ? payload : assignment
          ),
          loading: false
        };
      case DELETE_ASSIGNMENT:
        return {
          ...state,
          assignments: state.assignments.filter(assignment => assignment._id !== payload),
          loading: false
        };
      case ASSIGNMENT_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
        };
      case CLEAR_ASSIGNMENT:
        return {
          ...state,
          assignment: null
        };
      default:
        return state;
    }
  }