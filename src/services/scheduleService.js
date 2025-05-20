import api from './api';

// Get schedule for a class
export const getClassSchedule = async (classId) => {
  const response = await api.get(`/api/schedules/class/${classId}`);
  return response.data;
};

// Get schedules for all classes a user belongs to
export const getUserSchedules = async () => {
  const response = await api.get('/api/schedules/user');
  return response.data;
};

// Get a schedule item
export const getScheduleItem = async (scheduleId) => {
  const response = await api.get(`/api/schedules/${scheduleId}`);
  return response.data;
};

// Create a new schedule item
export const createScheduleItem = async (scheduleData) => {
  const response = await api.post('/api/schedules', scheduleData);
  return response.data;
};

// Update a schedule item
export const updateScheduleItem = async (scheduleId, scheduleData) => {
  const response = await api.put(`/api/schedules/${scheduleId}`, scheduleData);
  return response.data;
};

// Delete a schedule item
export const deleteScheduleItem = async (scheduleId) => {
  await api.delete(`/api/schedules/${scheduleId}`);
};

// Create or update class schedule
export const updateSchedule = async (scheduleId, scheduleData) => {
  const response = await api.put(`/api/schedules/${scheduleId}`, scheduleData);
  return response.data;
};

export const getScheduleByClass = async (classId) => {
  const response = await api.get(`/api/schedules/class/${classId}`);
  return response.data;
};