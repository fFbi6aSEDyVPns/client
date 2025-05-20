import api from './api';

// Get all assignments for a class
export const getClassAssignments = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}/assignments`);
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
export const createAssignment = async (classId, assignmentData) => {
  try {
    const response = await api.post(`/classes/${classId}/assignments`, assignmentData);
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

// Get a single assignment
export const getAssignment = async (id) => {
  try {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit an assignment
export const submitAssignment = async (assignmentId, submissionData) => {
  try {
    const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Grade a submission
export const gradeSubmission = async (assignmentId, submissionId, gradeData) => {
  try {
    const response = await api.put(
      `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      gradeData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};