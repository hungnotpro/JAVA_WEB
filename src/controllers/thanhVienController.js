import thanhVienService from '../services/thanhVienService';
import ThanhVienNhomModel from '../models/ThanhVienNhomModel';

/**
 * Controller xử lý logic nghiệp vụ liên quan đến thành viên
 */
const thanhVienController = {
  /**
   * Lấy tất cả thành viên của một nhóm
   * @param {number} nhomId ID của nhóm
   * @returns {Promise<Array<ThanhVienNhomModel>>} Danh sách thành viên
   */
  getThanhVienByNhom: async (nhomId) => {
    try {
      const response = await thanhVienService.getThanhVienByNhom(nhomId);
      return Array.isArray(response) 
        ? response.map(tv => ThanhVienNhomModel.fromAPI(tv)) 
        : [];
    } catch (error) {
      console.error(`Controller error - getThanhVienByNhom(${nhomId}):`, error);
      throw error;
    }
  },

  /**
   * Thêm thành viên vào nhóm
   * @param {number} nhomId ID của nhóm
   * @param {Object} thanhVienData Thông tin thành viên
   * @returns {Promise<ThanhVienNhomModel>} Thông tin thành viên đã thêm
   */
  addThanhVien: async (nhomId, thanhVienData) => {
    try {
      // Tạo model và validate dữ liệu
      const thanhVienModel = new ThanhVienNhomModel(thanhVienData);
      
      if (!thanhVienModel.isValid()) {
        throw new Error('Thông tin thành viên không hợp lệ. Vui lòng kiểm tra lại.');
      }
      
      // Chuẩn bị dữ liệu để gửi đi
      const requestData = {
        nhomId,
        ...thanhVienModel.toJSON()
      };
      
      // Thêm sinhVienId nếu có
      if (thanhVienData.sinhVienId) {
        requestData.sinhVienId = thanhVienData.sinhVienId;
      }
      
      // Gọi service để thêm thành viên
      const response = await thanhVienService.addThanhVien(requestData);
      
      // Trả về model từ response
      return ThanhVienNhomModel.fromAPI(response);
    } catch (error) {
      console.error('Controller error - addThanhVien:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin thành viên
   * @param {number} id ID của thành viên
   * @param {Object} thanhVienData Thông tin cập nhật
   * @returns {Promise<ThanhVienNhomModel>} Thông tin thành viên đã cập nhật
   */
  updateThanhVien: async (id, thanhVienData) => {
    try {
      // Tạo model và validate dữ liệu
      const thanhVienModel = new ThanhVienNhomModel({
        id,
        ...thanhVienData
      });
      
      if (!thanhVienModel.isValid()) {
        throw new Error('Thông tin thành viên không hợp lệ. Vui lòng kiểm tra lại.');
      }
      
      // Gọi service để cập nhật thông tin
      const response = await thanhVienService.updateThanhVien(id, thanhVienModel.toJSON());
      
      // Trả về model từ response
      return ThanhVienNhomModel.fromAPI(response);
    } catch (error) {
      console.error(`Controller error - updateThanhVien(${id}):`, error);
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
      await thanhVienService.deleteThanhVien(id);
      return true;
    } catch (error) {
      console.error(`Controller error - deleteThanhVien(${id}):`, error);
      throw error;
    }
  }
};

export default thanhVienController;