import {
  GET_CLASSES,
  GET_CLASS,
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  CLASS_ERROR,
  CLEAR_CLASS,
  ADD_STUDENT_TO_CLASS,
  REMOVE_STUDENT_FROM_CLASS
} from '../actions/types';

const initialState = {
  classes: [],
  currentClass: null,
  loading: true,
  error: null
};

const classesReducer = (state = initialState, action) => {
  const { type, payload } = action;
  console.log('classesReducer 收到 action:', { type, payload });
  console.log('當前狀態:', state);

  switch (type) {
    case GET_CLASSES:
      console.log('處理 GET_CLASSES action');
      return {
        ...state,
        classes: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    case GET_CLASS:
      console.log('處理 GET_CLASS action');
      return {
        ...state,
        currentClass: payload,
        loading: false,
        error: null
      };
    case CREATE_CLASS:
      console.log('處理 CREATE_CLASS action');
      const newState = {
        ...state,
        classes: Array.isArray(state.classes) ? [...state.classes, payload] : [payload],
        loading: false,
        error: null
      };
      console.log('CREATE_CLASS 後的新狀態:', newState);
      return newState;
    case UPDATE_CLASS:
      console.log('處理 UPDATE_CLASS action');
      return {
        ...state,
        classes: Array.isArray(state.classes) 
          ? state.classes.map((cls) => cls._id === payload._id ? payload : cls)
          : [payload],
        currentClass: payload,
        loading: false,
        error: null
      };
    case DELETE_CLASS:
      console.log('處理 DELETE_CLASS action');
      return {
        ...state,
        classes: Array.isArray(state.classes) 
          ? state.classes.filter((cls) => cls._id !== payload)
          : [],
        currentClass: null,
        loading: false,
        error: null
      };
    case ADD_STUDENT_TO_CLASS:
    case REMOVE_STUDENT_FROM_CLASS:
      console.log('處理 ADD/REMOVE_STUDENT action');
      return {
        ...state,
        currentClass: payload,
        loading: false,
        error: null
      };
    case CLASS_ERROR:
      console.log('處理 CLASS_ERROR action');
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_CLASS:
      console.log('處理 CLEAR_CLASS action');
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

export default classesReducer; 