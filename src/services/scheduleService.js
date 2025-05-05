import api from './api';

// Get schedule for a class
export const getClassSchedule = async (classId) => {
  try {
    const response = await api.get(`/schedules/class/${classId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get schedules for all classes a user belongs to
export const getUserSchedules = async () => {
  try {
    const response = await api.get('/schedules/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create or update class schedule
export const updateSchedule = async (classId, scheduleItems) => {
  try {
    const response = await api.put(`/schedules/class/${classId}`, { items: scheduleItems });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a schedule item
export const deleteScheduleItem = async (classId, itemId) => {
  try {
    const response = await api.delete(`/schedules/class/${classId}/item/${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};