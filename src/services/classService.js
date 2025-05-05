import axios from 'axios';

const API_URL = '/api/v1/classes/';

// 獲取所有班級
const getClasses = async (token, queryParams = {}) => {
  // 構建查詢字符串
  const queryString = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
  
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(url, config);
  
  return response.data;
};

// 獲取單個班級
const getClass = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(API_URL + id, config);
  
  return response.data;
};

// 創建班級
const createClass = async (classData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(API_URL, classData, config);
  
  return response.data;
};

// 更新班級
const updateClass = async (id, classData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(API_URL + id, classData, config);
  
  return response.data;
};

// 刪除班級
const deleteClass = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(API_URL + id, config);
  
  return response.data;
};

// 添加學生到班級
const addStudents = async (classId, studentIds, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(
    API_URL + classId + '/students', 
    { students: studentIds },
    config
  );
  
  return response.data;
};

// 從班級移除學生
const removeStudent = async (classId, studentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(
    API_URL + classId + '/students/' + studentId,
    config
  );
  
  return response.data;
};

// 獲取班級學生
const getClassStudents = async (classId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(
    API_URL + classId + '/students',
    config
  );
  
  return response.data;
};

const classService = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudents,
  removeStudent,
  getClassStudents
};

export default classService;