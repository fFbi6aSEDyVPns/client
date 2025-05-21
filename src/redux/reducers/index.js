import { combineReducers } from 'redux';
import authReducer from './auth';
import alertReducer from './alert';
import classReducer from './class';
import studyLogReducer from './studyLog';

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  class: classReducer,
  studyLog: studyLogReducer
});

export default rootReducer;