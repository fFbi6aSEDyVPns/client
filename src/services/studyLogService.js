import api from './api';

// Get all study logs for current user
export const getUserStudyLogs = async () => {
  try {
    const response = await api.get('/study-logs/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get study logs summary for current user
export const getUserStudyLogsSummary = async () => {
  try {
    const response = await api.get('/study-logs/summary');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get class study statistics (for teachers)
export const getClassStudyStatistics = async (classId) => {
  try {
    const response = await api.get(`/study-logs/class/${classId}/statistics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new study log
export const createStudyLog = async (studyLogData) => {
  try {
    const response = await api.post('/study-logs', studyLogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a study log
export const updateStudyLog = async (id, studyLogData) => {
  try {
    const response = await api.put(`/study-logs/${id}`, studyLogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a study log
export const deleteStudyLog = async (id) => {
  try {
    const response = await api.delete(`/study-logs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};