import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import classes from './classes';
import studyLog from './studyLog';

export default combineReducers({
  auth,
  alert,
  classes,
  studyLog
});