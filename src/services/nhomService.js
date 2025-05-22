import axios from 'axios';

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
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Service xử lý API liên quan đến nhóm
 */
export const nhomService = {
  /**
   * Lấy tất cả nhóm
   * @returns {Promise<Array>} Danh sách nhóm
   */
  getAllNhom: async () => {
    try {
      const response = await apiClient.get('/group');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Lấy nhóm theo ID
   * @param {number} id ID của nhóm
   * @returns {Promise<Object>} Thông tin nhóm
   */
  getNhomById: async (id) => {
    try {
      const response = await apiClient.get(`/group/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },
  /**
   * Lấy nhóm theo sinh viên ID
   * @param {number} sinhVienId ID của sinh viên
   * @returns {Promise<Array>} Danh sách nhóm của sinh viên
   */
  getNhomBySinhVien: async (sinhVienId) => {
    try {
      const response = await apiClient.get(`/group/sinhvien/${sinhVienId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching groups for student ${sinhVienId}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Lấy nhóm của người dùng hiện tại
   * @returns {Promise<Array>} Danh sách nhóm của người dùng hiện tại
   */
  getMyGroups: async () => {
    try {
      const response = await apiClient.get('/group/my-groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching my groups:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Tạo nhóm mới
   * @param {Object} nhomData Thông tin nhóm
   * @returns {Promise<Object>} Thông tin nhóm đã tạo
   */
  createNhom: async (nhomData) => {
    try {
      console.log('Creating new group with data:', nhomData);
      const response = await apiClient.post('/group', nhomData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Xóa nhóm
   * @param {number} id ID của nhóm
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteNhom: async (id) => {
    try {
      const response = await apiClient.delete(`/group/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  }
};

export default nhomService;