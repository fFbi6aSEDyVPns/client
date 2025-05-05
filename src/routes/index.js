import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, ROLES } from '../constants';
import PrivateRoute from '../components/routing/PrivateRoute';

// Import pages
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import ClassList from '../pages/ClassList';
import ClassDetail from '../pages/ClassDetail';
import ClassForm from '../pages/ClassForm';
import Assignment from '../pages/Assignment';
import Schedule from '../pages/Schedule';
import StudyLogs from '../pages/StudyLogs';
import ManageStudent from '../pages/ManageStudent';

// Import auth components
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Landing />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      
      {/* Protected routes */}
      <Route 
        path={ROUTES.DASHBOARD} 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.CLASSES} 
        element={
          <PrivateRoute>
            <ClassList />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.CLASS_DETAIL} 
        element={
          <PrivateRoute>
            <ClassDetail />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.CLASS_CREATE} 
        element={
          <PrivateRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMIN]}>
            <ClassForm />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.CLASS_EDIT} 
        element={
          <PrivateRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMIN]}>
            <ClassForm />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.ASSIGNMENTS} 
        element={
          <PrivateRoute>
            <Assignment />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.SCHEDULE} 
        element={
          <PrivateRoute>
            <Schedule />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.STUDY_LOGS} 
        element={
          <PrivateRoute>
            <StudyLogs />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path={ROUTES.MANAGE_STUDENTS} 
        element={
          <PrivateRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMIN]}>
            <ManageStudent />
          </PrivateRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;