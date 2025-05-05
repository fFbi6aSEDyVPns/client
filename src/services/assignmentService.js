import api from './api';

// Get all assignments for a class
export const getClassAssignments = async (classId) => {
  try {
    const response = await api.get(`/assignments/class/${classId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all assignments for current user
export const getUserAssignments = async () => {
  try {
    const response = await api.get('/assignments/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an assignment
export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update assignment status (for students)
export const updateAssignmentStatus = async (id, status) => {
  try {
    const response = await api.put(`/assignments/status/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an assignment
export const deleteAssignment = async (id) => {
  try {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};