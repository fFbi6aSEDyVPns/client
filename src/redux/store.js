import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {
  auth: {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  },
  alert: [],
  class: {
    classes: [],
    currentClass: null,
    loading: false,
    error: null
  },
  studyLog: {
    logs: [],
    currentLog: null,
    loading: false,
    error: null
  }
};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

// 添加 store 訂閱
store.subscribe(() => {
  const state = store.getState();
  console.log('Redux store updated - full state:', state);
  console.log('Redux store updated - class state:', state.class);
  console.log('Redux store updated - classes array:', state.class.classes);
  console.log('Redux store updated - classes length:', state.class.classes.length);
});

export default store;