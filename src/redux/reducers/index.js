import { combineReducers } from 'redux';
import auth from './auth';
import assignment from './assignment';
import classReducer from './class';
import schedule from './schedule';
import studyLog from './studyLog';

export default combineReducers({
  auth,
  assignment,
  class: classReducer,
  schedule,
  studyLog
});