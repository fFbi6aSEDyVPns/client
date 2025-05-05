import {
    GET_STUDY_LOGS,
    GET_STUDY_LOG,
    ADD_STUDY_LOG,
    UPDATE_STUDY_LOG,
    DELETE_STUDY_LOG,
    STUDY_LOG_ERROR,
    CLEAR_STUDY_LOG
  } from '../actions/types';
  
  const initialState = {
    studyLogs: [],
    studyLog: null,
    loading: true,
    error: {}
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_STUDY_LOGS:
        return {
          ...state,
          studyLogs: payload,
          loading: false
        };
      case GET_STUDY_LOG:
        return {
          ...state,
          studyLog: payload,
          loading: false
        };
      case ADD_STUDY_LOG:
        return {
          ...state,
          studyLogs: [payload, ...state.studyLogs],
          loading: false
        };
      case UPDATE_STUDY_LOG:
        return {
          ...state,
          studyLogs: state.studyLogs.map(log => 
            log._id === payload._id ? payload : log
          ),
          loading: false
        };
      case DELETE_STUDY_LOG:
        return {
          ...state,
          studyLogs: state.studyLogs.filter(log => log._id !== payload),
          loading: false
        };
      case STUDY_LOG_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
        };
      case CLEAR_STUDY_LOG:
        return {
          ...state,
          studyLog: null
        };
      default:
        return state;
    }
  }