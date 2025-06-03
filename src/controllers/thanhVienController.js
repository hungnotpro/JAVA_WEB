import thanhVienService from '../services/thanhVienService';

/**
 * Controller xử lý logic nghiệp vụ liên quan đến thành viên
 */
const thanhVienController = {
  /**
   * Lấy tất cả thành viên của một nhóm
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Array>} Danh sách thành viên
   */
  getThanhVienByNhom: async (nhomId) => {
    try {
      const response = await thanhVienService.getThanhVienByNhom(nhomId);
      return response;
    } catch (error) {
      console.error('Controller error - getThanhVienByNhom:', error);
      throw error;
    }
  },
  /**
   * Thêm thành viên vào nhóm
   * @param {Object} thanhVienData Thông tin thành viên
   * @returns {Promise<Object>} Thông tin thành viên đã thêm
   */
  addThanhVien: async (thanhVienData) => {
    try {
      console.log('Controller - addThanhVien received data:', thanhVienData);
      
      // Validate dữ liệu
      if (!thanhVienData || typeof thanhVienData !== 'object') {
        throw new Error('Dữ liệu thành viên không hợp lệ');
      }

      if (!thanhVienData.hoTen || !thanhVienData.hoTen.trim()) {
        throw new Error('Họ tên thành viên không được để trống');
      }

      if (!thanhVienData.maSinhVien || !thanhVienData.maSinhVien.trim()) {
        throw new Error('Mã sinh viên không được để trống');
      }

      if (!thanhVienData.nhomId) {
        throw new Error('ID nhóm không được để trống');
      }

      const response = await thanhVienService.addThanhVien(thanhVienData);
      return response;
    } catch (error) {
      console.error('Controller error - addThanhVien:', error);
      throw error;
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
      // Validate dữ liệu
      if (!id) {
        throw new Error('ID thành viên không được để trống');
      }

      if (!thanhVienData.hoTen || !thanhVienData.hoTen.trim()) {
        throw new Error('Họ tên thành viên không được để trống');
      }

      if (!thanhVienData.maSinhVien || !thanhVienData.maSinhVien.trim()) {
        throw new Error('Mã sinh viên không được để trống');
      }

      const response = await thanhVienService.updateThanhVien(id, thanhVienData);
      return response;
    } catch (error) {
      console.error('Controller error - updateThanhVien:', error);
      throw error;
    }
  },

  /**
   * Xóa thành viên khỏi nhóm
   * @param {number} id ID của thành viên
   * @returns {Promise<boolean>} true nếu xóa thành công
   */
  deleteThanhVien: async (id) => {
    try {
      if (!id) {
        throw new Error('ID thành viên không được để trống');
      }

      const response = await thanhVienService.deleteThanhVien(id);
      return response;
    } catch (error) {
      console.error('Controller error - deleteThanhVien:', error);
      throw error;
    }
  }
};

export default thanhVienController;