import axios from 'axios';
import TopicModel from '../models/TopicModel';

const API_URL = 'http://localhost:8080/api';

// Tạo axios instance với config mặc định
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Topic services
const topicService = {
  // Lấy danh sách tất cả đề tài
  getAllTopics: async () => {
    try {
      const response = await apiClient.get('/topics');
      return response.data.map(topic => TopicModel.fromAPI(topic));
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Lấy thông tin chi tiết một đề tài
  getTopicById: async (id) => {
    try {
      const response = await apiClient.get(`/topics/${id}`);
      return TopicModel.fromAPI(response.data);
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Tạo đề tài mới (Admin)
  createTopic: async (topicData) => {
    try {
      const response = await apiClient.post('/topics', topicData);
      return TopicModel.fromAPI(response.data);
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Cập nhật đề tài (Admin)
  updateTopic: async (id, topicData) => {
    try {
      const response = await apiClient.put(`/topics/${id}`, topicData);
      return TopicModel.fromAPI(response.data);
    } catch (error) {
      console.error(`Error updating topic ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Xóa đề tài (Admin)
  deleteTopic: async (id) => {
    try {
      await apiClient.delete(`/topics/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting topic ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Đăng ký đề tài (Student)
  registerTopic: async (topicId) => {
    try {
      const response = await apiClient.post(`/topics/${topicId}/register`);
      return response.data;
    } catch (error) {
      console.error(`Error registering for topic ${topicId}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Hủy đăng ký đề tài (Student)
  unregisterTopic: async (topicId) => {
    try {
      const response = await apiClient.post(`/topics/${topicId}/unregister`);
      return response.data;
    } catch (error) {
      console.error(`Error unregistering from topic ${topicId}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Lấy danh sách đề tài đã đăng ký của sinh viên
  getStudentTopics: async () => {
    try {
      const response = await apiClient.get('/students/me/topics');
      return response.data.map(topic => TopicModel.fromAPI(topic));
    } catch (error) {
      console.error('Error fetching student topics:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  }
};

export default topicService;