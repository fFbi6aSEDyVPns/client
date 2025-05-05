import {
    GET_SCHEDULES,
    GET_SCHEDULE,
    ADD_SCHEDULE,
    UPDATE_SCHEDULE,
    DELETE_SCHEDULE,
    SCHEDULE_ERROR,
    CLEAR_SCHEDULE
  } from '../actions/types';
  
  const initialState = {
    schedules: [],
    schedule: null,
    loading: true,
    error: {}
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_SCHEDULES:
        return {
          ...state,
          schedules: payload,
          loading: false
        };
      case GET_SCHEDULE:
        return {
          ...state,
          schedule: payload,
          loading: false
        };
      case ADD_SCHEDULE:
        return {
          ...state,
          schedules: [payload, ...state.schedules],
          loading: false
        };
      case UPDATE_SCHEDULE:
        return {
          ...state,
          schedules: state.schedules.map(schedule => 
            schedule._id === payload._id ? payload : schedule
          ),
          loading: false
        };
      case DELETE_SCHEDULE:
        return {
          ...state,
          schedules: state.schedules.filter(schedule => schedule._id !== payload),
          loading: false
        };
      case SCHEDULE_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
        };
      case CLEAR_SCHEDULE:
        return {
          ...state,
          schedule: null
        };
      default:
        return state;
    }
  }