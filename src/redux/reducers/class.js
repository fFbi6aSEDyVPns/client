import {
    GET_CLASSES,
    GET_CLASS,
    CREATE_CLASS,
    UPDATE_CLASS,
    DELETE_CLASS,
    CLASS_ERROR,
    CLEAR_CLASS,
    SET_LOADING,
    ADD_STUDENT_TO_CLASS,
    REMOVE_STUDENT_FROM_CLASS
  } from '../actions/types';
  
  const initialState = {
    classes: [],
    currentClass: null,
    loading: false,
    error: null
  };
  
  const classReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case SET_LOADING:
        return {
          ...state,
          loading: true
        };
      case GET_CLASSES:
        return {
          ...state,
          classes: payload,
          loading: false,
          error: null
        };
      case GET_CLASS:
        return {
          ...state,
          currentClass: payload,
          loading: false,
          error: null
        };
      case CREATE_CLASS:
        return {
          ...state,
          classes: [...state.classes, payload],
          loading: false,
          error: null
        };
      case UPDATE_CLASS:
        return {
          ...state,
          classes: state.classes.map(cls => 
            cls._id === payload._id ? payload : cls
          ),
          currentClass: payload,
          loading: false,
          error: null
        };
      case DELETE_CLASS:
        return {
          ...state,
          classes: state.classes.filter(cls => cls._id !== payload),
          currentClass: null,
          loading: false,
          error: null
        };
      case ADD_STUDENT_TO_CLASS:
        return {
          ...state,
          currentClass: {
            ...state.currentClass,
            students: [...state.currentClass.students, payload]
          },
          loading: false
        };
      case REMOVE_STUDENT_FROM_CLASS:
        return {
          ...state,
          currentClass: {
            ...state.currentClass,
            students: state.currentClass.students.filter(student => student._id !== payload)
          },
          loading: false
        };
      case CLASS_ERROR:
        return {
          ...state,
          error: payload.msg,
          loading: false
        };
      case CLEAR_CLASS:
        return {
          ...state,
          currentClass: null,
          loading: false,
          error: null
        };
      default:
        return state;
    }
  };
  
  export default classReducer;