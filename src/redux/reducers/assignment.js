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
  } from '../actions/types';
  
  const initialState = {
    assignments: [],
    assignment: null,
    loading: true,
    error: null
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_ASSIGNMENTS:
        return {
          ...state,
          assignments: payload,
          loading: false,
          error: null
        };
      case GET_ASSIGNMENT:
        return {
          ...state,
          assignment: payload,
          loading: false,
          error: null
        };
      case CREATE_ASSIGNMENT:
        return {
          ...state,
          assignments: [payload, ...state.assignments],
          loading: false,
          error: null
        };
      case UPDATE_ASSIGNMENT:
        return {
          ...state,
          assignments: state.assignments.map(assignment => 
            assignment._id === payload._id ? payload : assignment
          ),
          assignment: payload,
          loading: false,
          error: null
        };
      case DELETE_ASSIGNMENT:
        return {
          ...state,
          assignments: state.assignments.filter(assignment => assignment._id !== payload),
          assignment: null,
          loading: false,
          error: null
        };
      case SUBMIT_ASSIGNMENT:
        return {
          ...state,
          assignment: {
            ...state.assignment,
            submissions: [...state.assignment.submissions, payload]
          },
          loading: false,
          error: null
        };
      case GRADE_ASSIGNMENT:
        return {
          ...state,
          assignment: {
            ...state.assignment,
            submissions: state.assignment.submissions.map(submission =>
              submission._id === payload._id ? payload : submission
            )
          },
          loading: false,
          error: null
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
          assignment: null,
          loading: true,
          error: null
        };
      default:
        return state;
    }
  }