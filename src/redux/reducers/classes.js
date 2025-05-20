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

  switch (type) {
    case GET_CLASSES:
      return {
        ...state,
        classes: payload,
        loading: false
      };
    case GET_CLASS:
      return {
        ...state,
        currentClass: payload,
        loading: false
      };
    case CREATE_CLASS:
      return {
        ...state,
        classes: [...state.classes, payload],
        loading: false
      };
    case UPDATE_CLASS:
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls._id === payload._id ? payload : cls
        ),
        currentClass: payload,
        loading: false
      };
    case DELETE_CLASS:
      return {
        ...state,
        classes: state.classes.filter((cls) => cls._id !== payload),
        currentClass: null,
        loading: false
      };
    case ADD_STUDENT_TO_CLASS:
    case REMOVE_STUDENT_FROM_CLASS:
      return {
        ...state,
        currentClass: payload,
        loading: false
      };
    case CLASS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_CLASS:
      return {
        ...state,
        currentClass: null,
        loading: false
      };
    default:
      return state;
  }
};

export default classesReducer; 