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
      console.log(`Getting members for group ${nhomId}`);
      const response = await apiClient.get(`/member/nhom/${nhomId}`);
      
      // Kiểm tra response structure
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Lấy danh sách thành viên thất bại');
      }
    } catch (error) {
      console.error(`Service error - getThanhVienByNhom(${nhomId}):`, error);
      
      // Xử lý error response từ server
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Lấy danh sách thành viên thất bại');
      }
      
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
      console.log('Service - addThanhVien called with:', thanhVienData);
      
      // Cấu trúc dữ liệu theo API spec (khớp với Dart code bạn cung cấp)
      const requestData = {
        nhomId: parseInt(thanhVienData.nhomId), // Đảm bảo là number
        hoTen: thanhVienData.hoTen.trim(), // Loại bỏ khoảng trắng
        maSinhVien: thanhVienData.maSinhVien.trim() // Loại bỏ khoảng trắng
      };

      console.log('Sending to API /member:', requestData);
      
      const response = await apiClient.post('/member', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response:', response.data);
      
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
        const errorMessage = error.response.data.message || 'Thêm thành viên thất bại';
        console.error('Server error message:', errorMessage);
        throw new Error(errorMessage);
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
      console.log(`Updating member ${id} with:`, thanhVienData);
      
      // Cấu trúc dữ liệu cho update
      const requestData = {
        hoTen: thanhVienData.hoTen.trim(),
        maSinhVien: thanhVienData.maSinhVien.trim()
      };

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