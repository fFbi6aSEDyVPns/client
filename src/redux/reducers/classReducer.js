import {
  GET_CLASSES,
  GET_CLASS,
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  CLASS_ERROR,
  CLEAR_CLASS,
  ADD_STUDENT_TO_CLASS,
  REMOVE_STUDENT_FROM_CLASS,
  SET_LOADING,
  CLEAR_CLASS_ERROR
} from '../actions/types';

const initialState = {
  classes: [],
  currentClass: null,
  loading: false,
  error: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CLASSES:
      console.log('GET_CLASSES reducer - action.payload:', action.payload);
      if (action.payload && action.payload.success && Array.isArray(action.payload.data)) {
        console.log('GET_CLASSES reducer - valid data structure');
        const newState = {
          ...state,
          classes: action.payload.data,
          loading: false,
          error: null
        };
        console.log('GET_CLASSES reducer - new state:', newState);
        console.log('GET_CLASSES reducer - classes length:', newState.classes.length);
        return newState;
      } else {
        console.error('GET_CLASSES reducer - invalid data structure:', action.payload);
        return {
          ...state,
          classes: [],
          loading: false,
          error: '獲取班級列表失敗：數據格式錯誤'
        };
      }
    case GET_CLASS:
      return {
        ...state,
        currentClass: action.payload.data,
        loading: false,
        error: null
      };
    case CREATE_CLASS:
      const currentClasses = Array.isArray(state.classes) ? state.classes : [];
      
      if (action.payload && action.payload.data) {
        const classExists = currentClasses.some(
          (item) => item._id === action.payload.data._id || item.id === action.payload.data.id
        );
        
        if (!classExists) {
          return {
            ...state,
            classes: [...currentClasses, action.payload.data],
            currentClass: action.payload.data,
            loading: false,
            error: null
          };
        }
      }
      
      return {
        ...state,
        loading: false,
        error: null
      };
    case UPDATE_CLASS:
      const existingClasses = Array.isArray(state.classes) ? state.classes : [];
      return {
        ...state,
        classes: existingClasses.map((classItem) =>
          classItem._id === action.payload.data._id ? action.payload.data : classItem
        ),
        currentClass: action.payload.data,
        loading: false,
        error: null
      };
    case DELETE_CLASS:
      const remainingClasses = Array.isArray(state.classes) ? state.classes : [];
      return {
        ...state,
        classes: remainingClasses.filter((classItem) => classItem._id !== action.payload),
        currentClass: null,
        loading: false,
        error: null
      };
    case ADD_STUDENT_TO_CLASS:
      return {
        ...state,
        currentClass: action.payload.data,
        loading: false,
        error: null
      };
    case REMOVE_STUDENT_FROM_CLASS:
      return {
        ...state,
        currentClass: action.payload.data,
        loading: false,
        error: null
      };
    case CLASS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_CLASS:
      return {
        ...state,
        currentClass: null,
        loading: false,
        error: null
      };
    case CLEAR_CLASS_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
} 