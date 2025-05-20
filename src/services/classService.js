import api from './api';

// 獲取所有班級
export const getClasses = async (queryParams = {}) => {
  // 構建查詢字符串
  const queryString = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
  
  const url = queryString ? `/classes?${queryString}` : '/classes';
  
  const response = await api.get(url);
  return response.data;
};

// 獲取單個班級
export const getClass = async (id) => {
  if (!id) {
    throw new Error('班級 ID 不能為空');
  }
  
  const response = await api.get(`/classes/${id}`);
  return response.data;
};

// 創建班級
export const createClass = async (classData) => {
  const response = await api.post('/classes', classData);
  return response.data;
};

// 更新班級
export const updateClass = async (id, classData) => {
  const response = await api.put(`/classes/${id}`, classData);
  return response.data;
};

// 刪除班級
export const deleteClass = async (id) => {
  const response = await api.delete(`/classes/${id}`);
  return response.data;
};

// 添加學生到班級
export const addStudents = async (classId, studentIds) => {
  const response = await api.put(
    `/classes/${classId}/students`,
    { students: studentIds }
  );
  return response.data;
};

// 從班級移除學生
export const removeStudent = async (classId, studentId) => {
  const response = await api.delete(
    `/classes/${classId}/students/${studentId}`
  );
  return response.data;
};

// 獲取班級學生
export const getClassStudents = async (classId) => {
  const response = await api.get(`/classes/${classId}/students`);
  return response.data;
};