import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/actions/auth';
import setAuthToken from './utils/setAuthToken';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme';

// Components
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Landing from './components/pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';
import Classes from './components/class/Classes';
import CreateClass from './components/class/CreateClass';
import Assignments from './components/assignments/Assignments';
import StudyLogs from './components/study-logs/StudyLogs';
import './App.css';

// Check for token
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const App = () => {
  useEffect(() => {
    if (token) {
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Alert />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/classes"
                element={
                  <PrivateRoute>
                    <Classes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-class"
                element={
                  <PrivateRoute>
                    <CreateClass />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/assignments"
                element={
                  <PrivateRoute>
                    <Assignments />
                  </PrivateRoute>
                }
              />
              <Route
                path="/study-logs"
                element={
                  <PrivateRoute>
                    <StudyLogs />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;