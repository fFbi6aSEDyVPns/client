import {
  GET_SCHEDULES,
  GET_SCHEDULE,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  DELETE_SCHEDULE_ITEM,
  SCHEDULE_ERROR,
  CLEAR_SCHEDULE,
  ADD_SCHEDULE
} from '../actions/types';

const initialState = {
  schedules: [],
  schedule: null,
  loading: true,
  error: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SCHEDULES:
      return {
        ...state,
        schedules: payload,
        loading: false,
        error: null
      };
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: payload,
        loading: false,
        error: null
      };
    case CREATE_SCHEDULE:
      return {
        ...state,
        schedules: [payload, ...state.schedules],
        loading: false,
        error: null
      };
    case UPDATE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.map(schedule => 
          schedule._id === payload._id ? payload : schedule
        ),
        schedule: payload,
        loading: false,
        error: null
      };
    case DELETE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule._id !== payload),
        schedule: null,
        loading: false,
        error: null
      };
    case DELETE_SCHEDULE_ITEM:
      return {
        ...state,
        schedule: {
          ...state.schedule,
          items: state.schedule.items.filter(item => item._id !== payload._id)
        },
        loading: false,
        error: null
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
        schedule: null,
        loading: true,
        error: null
      };
    default:
      return state;
  }
}