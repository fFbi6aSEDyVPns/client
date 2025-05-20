import api from './api';

// Get all study logs for current user
export const getUserStudyLogs = async () => {
  const response = await api.get('/api/study-logs/user');
  return response.data;
};

// Get study logs summary for current user
export const getUserStudyLogsSummary = async () => {
  const response = await api.get('/api/study-logs/user/summary');
  return response.data;
};

// Get class study statistics (for teachers)
export const getClassStudyStatistics = async (classId) => {
  const response = await api.get(`/api/study-logs/class/${classId}/statistics`);
  return response.data;
};

// Get a specific study log
export const getStudyLog = async (logId) => {
  const response = await api.get(`/study-logs/${logId}`);
  return response.data;
};

// Create a new study log
export const createStudyLog = async (classId, logData) => {
  const response = await api.post(`/classes/${classId}/study-logs`, logData);
  return response.data;
};

// Update a study log
export const updateStudyLog = async (logId, logData) => {
  const response = await api.put(`/study-logs/${logId}`, logData);
  return response.data;
};

// Delete a study log
export const deleteStudyLog = async (logId) => {
  const response = await api.delete(`/study-logs/${logId}`);
  return response.data;
};

export const getStudyLogsByClass = async (classId) => {
  const response = await api.get(`/api/study-logs/class/${classId}`);
  return response.data;
};

export const getStudyLogsByStudent = async (studentId) => {
  const response = await api.get(`/api/study-logs/student/${studentId}`);
  return response.data;
};

// 獲取班級的所有學習日誌
export const getStudyLogs = async (classId) => {
  const response = await api.get(`/classes/${classId}/study-logs`);
  return response.data;
};