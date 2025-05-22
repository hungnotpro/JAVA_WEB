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
 * Service xử lý API liên quan đến nhóm đăng ký đề tài
 */
export const nhomDangKyService = {
  /**
   * Đăng ký nhóm mới
   * @param {Object} nhomData Dữ liệu nhóm đăng ký
   * @returns {Promise} Promise kết quả API
   */
  dangKyNhom: async (nhomData) => {
    try {
      const response = await apiClient.post('/group', nhomData);
      return response.data;
    } catch (error) {
      console.error('Error đăng ký nhóm:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Lấy thông tin nhóm đang đăng ký
   * @param {number} deTaiId ID của đề tài cần lấy nhóm
   * @returns {Promise} Promise kết quả API
   */
  layThongTinNhom: async (deTaiId) => {
    try {
      const response = await apiClient.get(`/group/${deTaiId}`);
      return response.data;
    } catch (error) {
      console.error('Error lấy thông tin nhóm:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Cập nhật thông tin nhóm
   * @param {number} nhomId ID của nhóm cần cập nhật
   * @param {Object} nhomData Dữ liệu nhóm cập nhật
   * @returns {Promise} Promise kết quả API
   */
  capNhatNhom: async (nhomId, nhomData) => {
    try {
      const response = await apiClient.put(`/group/${nhomId}`, nhomData);
      return response.data;
    } catch (error) {
      console.error('Error cập nhật nhóm:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  /**
   * Hủy đăng ký nhóm
   * @param {number} nhomId ID của nhóm cần hủy
   * @returns {Promise} Promise kết quả API
   */
  huyDangKyNhom: async (nhomId) => {
    try {
      const response = await apiClient.delete(`/group/${nhomId}`);
      return response.data;
    } catch (error) {
      console.error('Error hủy đăng ký nhóm:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  }
};

export default nhomDangKyService;