import apiClient from '../utils/apiClient';

/**
 * Service xử lý API liên quan đến nhóm đăng ký đề tài
 */
export const nhomDangKyService = {
  /**
   * Đăng ký nhóm mới cho đề tài
   * @param {Object} nhomData Thông tin nhóm đăng ký
   * @returns {Promise<Object>} Thông tin nhóm đã đăng ký
   */  dangKyNhom: async (nhomData) => {
    try {
      console.log('nhomDangKyService - Sending data:', nhomData);
      const response = await apiClient.post('/group', nhomData);
      console.log('nhomDangKyService - Response:', response.data);
      
      // Kiểm tra response structure và return data đúng cách
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        console.error('API response error:', response.data);
        throw new Error(response.data?.message || 'Đăng ký nhóm thất bại');
      }
    } catch (error) {
      console.error('Service error - dangKyNhom:', error);
      console.error('Error response:', error.response?.data);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng ký nhóm thất bại');
      }
      
      throw error;
    }
  },

  /**
   * Lấy thông tin nhóm đăng ký cho đề tài
   * @param {number} deTaiId ID của đề tài
   * @returns {Promise<Array>} Danh sách nhóm đã đăng ký
   */
  layThongTinNhom: async (deTaiId) => {
    try {
      const response = await apiClient.get(`/group/detai/${deTaiId}`);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - layThongTinNhom(${deTaiId}):`, error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin nhóm đăng ký
   * @param {number} nhomId ID của nhóm
   * @param {Object} nhomData Thông tin nhóm cần cập nhật
   * @returns {Promise<Object>} Thông tin nhóm đã cập nhật
   */
  capNhatNhom: async (nhomId, nhomData) => {
    try {
      const response = await apiClient.put(`/group/${nhomId}`, nhomData);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - capNhatNhom(${nhomId}):`, error);
      throw error;
    }
  },

  /**
   * Hủy đăng ký nhóm
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Object>} Kết quả hủy đăng ký
   */
  huyDangKyNhom: async (nhomId) => {
    try {
      const response = await apiClient.delete(`/group/${nhomId}`);
      return response.data;
    } catch (error) {
      console.error(`Service error - huyDangKyNhom(${nhomId}):`, error);
      throw error;
    }
  }
};

export default nhomDangKyService;