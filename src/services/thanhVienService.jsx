import apiClient from '../utils/apiClient';

/**
 * Service xử lý API liên quan đến thành viên nhóm
 */
const thanhVienService = {
  /**
   * Lấy thành viên theo nhóm
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Array>} Danh sách thành viên
   */
  getThanhVienByNhom: async (nhomId) => {
    try {
      const response = await apiClient.get(`/member/nhom/${nhomId}`);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - getThanhVienByNhom(${nhomId}):`, error);
      throw error;
    }
  },
  /**
   * Thêm thành viên mới
   * @param {Object} thanhVienData Thông tin thành viên
   * @returns {Promise<Object>} Thông tin thành viên đã thêm
   */
  addThanhVien: async (thanhVienData) => {
    try {
      // Cấu trúc dữ liệu theo API spec
      const requestData = {
        nhomId: thanhVienData.nhomId,
        hoTen: thanhVienData.hoTen,
        maSinhVien: thanhVienData.maSinhVien
      };

      console.log('Adding member with data:', requestData);
      
      const response = await apiClient.post('/member', requestData);
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Thêm thành viên thất bại');
      }
    } catch (error) {
      console.error('Service error - addThanhVien:', error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Thêm thành viên thất bại');
      }
      
      throw error;
    }
  },
  /**
   * Cập nhật thành viên
   * @param {number} id ID của thành viên
   * @param {Object} thanhVienData Thông tin thành viên cần cập nhật
   * @returns {Promise<Object>} Thông tin thành viên đã cập nhật
   */
  updateThanhVien: async (id, thanhVienData) => {
    try {
      // Cấu trúc dữ liệu cho update (chỉ gửi hoTen và maSinhVien)
      const requestData = {
        hoTen: thanhVienData.hoTen,
        maSinhVien: thanhVienData.maSinhVien
      };

      console.log(`Updating member ${id} with data:`, requestData);
      
      const response = await apiClient.put(`/member/${id}`, requestData);
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Cập nhật thành viên thất bại');
      }
    } catch (error) {
      console.error(`Service error - updateThanhVien(${id}):`, error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Cập nhật thành viên thất bại');
      }
      
      throw error;
    }
  },
  /**
   * Xóa thành viên
   * @param {number} id ID của thành viên
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteThanhVien: async (id) => {
    try {
      console.log(`Deleting member with ID: ${id}`);
      
      const response = await apiClient.delete(`/member/${id}`);
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Xóa thành viên thất bại');
      }
    } catch (error) {
      console.error(`Service error - deleteThanhVien(${id}):`, error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Xóa thành viên thất bại');
      }
      
      throw error;
    }
  }
};

export default thanhVienService;