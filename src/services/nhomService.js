import apiClient from '../utils/apiClient';

/**
 * Service xử lý các API liên quan đến nhóm
 */
const nhomService = {
  /**
   * Lấy danh sách nhóm của sinh viên hiện tại
   * @returns {Promise<Array<Object>>} Danh sách nhóm
   */
  getMyGroups: async () => {
    try {
      const response = await apiClient.get('/group/my-groups');
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result || [];
      } else {
        throw new Error(response.data?.message || 'Không thể lấy danh sách nhóm');
      }
    } catch (error) {
      console.error('Service error - getMyGroups:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi lấy danh sách nhóm');
      }
      throw error;
    }
  },
  
  /**
   * Lấy thông tin nhóm theo ID
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Object>} Thông tin nhóm
   */
  getNhomById: async (nhomId) => {
    try {
      const response = await apiClient.get(`/group/${nhomId}`);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không thể lấy thông tin nhóm');
      }
    } catch (error) {
      console.error(`Service error - getNhomById(${nhomId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi lấy thông tin nhóm');
      }
      throw error;
    }
  },
  
  /**
   * Lấy danh sách thành viên theo ID nhóm
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Array<Object>>} Danh sách thành viên
   */
  getThanhViensByNhomId: async (nhomId) => {
    try {
      const response = await apiClient.get(`/member/nhom/${nhomId}`);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result || [];
      } else {
        throw new Error(response.data?.message || 'Không thể lấy danh sách thành viên');
      }
    } catch (error) {
      console.error(`Service error - getThanhViensByNhomId(${nhomId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi lấy danh sách thành viên');
      }
      throw error;
    }
  },
    /**
   * Thêm thành viên vào nhóm (API cũ: POST /member/nhom/{nhomId})
   * @param {number} nhomId ID của nhóm
   * @param {Object} thanhVienData Thông tin thành viên
   * @returns {Promise<Object>} Thông tin thành viên đã thêm
   */
  addThanhVien: async (nhomId, thanhVienData) => {
    try {
      // Sử dụng API mới: POST /member với thông tin nhóm
      const payload = {
        nhomId: nhomId,
        hoTen: thanhVienData.hoTen,
        maSinhVien: thanhVienData.maSinhVien
      };
      
      const response = await apiClient.post('/member', payload);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không thể thêm thành viên');
      }
    } catch (error) {
      console.error(`Service error - addThanhVien(${nhomId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi thêm thành viên');
      }
      throw error;
    }
  },
  
  /**
   * Cập nhật thông tin thành viên
   * @param {number} memberId ID của thành viên
   * @param {Object} thanhVienData Thông tin cập nhật
   * @returns {Promise<Object>} Thông tin thành viên đã cập nhật
   */
  updateThanhVien: async (memberId, thanhVienData) => {
    try {
      const response = await apiClient.put(`/member/${memberId}`, {
        hoTen: thanhVienData.hoTen,
        maSinhVien: thanhVienData.maSinhVien
      });
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không thể cập nhật thành viên');
      }
    } catch (error) {
      console.error(`Service error - updateThanhVien(${memberId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi cập nhật thành viên');
      }
      throw error;
    }
  },
  
  /**
   * Xóa thành viên khỏi nhóm
   * @param {number} memberId ID của thành viên
   * @returns {Promise<boolean>} Kết quả xóa
   */
  deleteThanhVien: async (memberId) => {
    try {
      const response = await apiClient.delete(`/member/${memberId}`);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Không thể xóa thành viên');
      }
    } catch (error) {
      console.error(`Service error - deleteThanhVien(${memberId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi xóa thành viên');
      }
      throw error;
    }
  }
};

export default nhomService;