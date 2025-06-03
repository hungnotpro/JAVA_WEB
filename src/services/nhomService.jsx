import apiClient from '../utils/apiClient';


/**
 * Service xử lý API liên quan đến nhóm
 */
const nhomService = {
  /**
   * Lấy tất cả nhóm
   * @returns {Promise<Array>} Danh sách nhóm
   */
  getAllNhom: async () => {
    try {
      console.log('Fetching all groups...');
      const response = await apiClient.get('/group');
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Lấy danh sách nhóm thất bại');
      }
    } catch (error) {
      console.error('Service error - getAllNhom:', error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Lấy danh sách nhóm thất bại');
      }
      
      throw error;
    }
  },
  /**
   * Lấy nhóm theo ID
   * @param {number} id ID của nhóm
   * @returns {Promise<Object>} Thông tin nhóm
   */
  getNhomById: async (id) => {
    try {
      console.log(`Fetching group by ID: ${id}`);
      const response = await apiClient.get(`/group/${id}`);
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Lấy thông tin nhóm thất bại');
      }
    } catch (error) {
      console.error(`Service error - getNhomById(${id}):`, error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Lấy thông tin nhóm thất bại');
      }
      
      throw error;
    }
  },

  /**
   * Lấy nhóm theo sinh viên ID
   * @param {number} sinhVienId ID của sinh viên
   * @returns {Promise<Array>} Danh sách nhóm
   */
  getNhomBySinhVien: async (sinhVienId) => {
    try {
      const response = await apiClient.get(`/group/sinhvien/${sinhVienId}`);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - getNhomBySinhVien(${sinhVienId}):`, error);
      throw error;
    }
  },
  
  /**
   * Lấy nhóm theo tài khoản ID
   * @param {number} accountId ID của tài khoản
   * @returns {Promise<Array>} Danh sách nhóm
   */
  getNhomByAccount: async (accountId) => {
    try {
      const response = await apiClient.get(`/group/account/${accountId}`);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - getNhomByAccount(${accountId}):`, error);
      throw error;
    }
  },

  /**
   * Lấy nhóm của người dùng hiện tại
   * @returns {Promise<Array>} Danh sách nhóm của người dùng hiện tại
   */
  getMyGroups: async () => {
    try {
      const response = await apiClient.get('/group/my-groups');
      return response.data.result;
    } catch (error) {
      console.error('Service error - getMyGroups:', error);
      throw error;
    }
  },

  /**
   * Tạo nhóm mới
   * @param {Object} nhomData Thông tin nhóm
   * @returns {Promise<Object>} Thông tin nhóm đã tạo
   */
  createNhom: async (nhomData) => {
    try {
      const response = await apiClient.post('/group', nhomData);
      return response.data.result;
    } catch (error) {
      console.error('Service error - createNhom:', error);
      throw error;
    }
  },
  /**
   * Xóa nhóm
   * @param {number} id ID của nhóm
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteNhom: async (id) => {
    try {
      console.log(`Deleting group with ID: ${id}`);
      const response = await apiClient.delete(`/group/${id}`);
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Xóa nhóm thất bại');
      }
    } catch (error) {
      console.error(`Service error - deleteNhom(${id}):`, error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Xóa nhóm thất bại');
      }
        throw error;
    }
  }
};

export default nhomService;