// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CLASSES: '/classes',
  CLASS_DETAIL: '/classes/:id',
  CLASS_CREATE: '/classes/create',
  CLASS_EDIT: '/classes/edit/:id',
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_DETAIL: '/assignments/:id',
  SCHEDULE: '/schedule',
  STUDY_LOGS: '/study-logs',
  MANAGE_STUDENTS: '/manage-students'
};

// User Roles
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

// Form validation messages
export const VALIDATION = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  PASSWORD_MATCH: 'Passwords do not match'
};

// Status codes
export const STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_info'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm'
};