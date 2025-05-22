import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Sử dụng cùng apiClient từ nhomService
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
 * Service xử lý API liên quan đến thành viên nhóm
 */
export const thanhVienService = {
  /**
   * Lấy tất cả thành viên của một nhóm
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Array>} Danh sách thành viên
   */
  getThanhVienByNhom: async (nhomId) => {
    try {
      const response = await apiClient.get(`/member/nhom/${nhomId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for group ${nhomId}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Thêm thành viên vào nhóm
   * @param {Object} thanhVienData Thông tin thành viên
   * @returns {Promise<Object>} Thông tin thành viên đã thêm
   */
  addThanhVien: async (thanhVienData) => {
    try {
      console.log('Adding new member with data:', thanhVienData);
      const response = await apiClient.post('/member', thanhVienData);
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Cập nhật thông tin thành viên
   * @param {number} id ID của thành viên
   * @param {Object} thanhVienData Thông tin cập nhật
   * @returns {Promise<Object>} Thông tin thành viên đã cập nhật
   */
  updateThanhVien: async (id, thanhVienData) => {
    try {
      const response = await apiClient.put(`/member/${id}`, thanhVienData);
      return response.data;
    } catch (error) {
      console.error(`Error updating member ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Xóa thành viên khỏi nhóm
   * @param {number} id ID của thành viên
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteThanhVien: async (id) => {
    try {
      const response = await apiClient.delete(`/member/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting member ${id}:`, error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  }
};

export default thanhVienService;