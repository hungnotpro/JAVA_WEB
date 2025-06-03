import nhomService from '../services/nhomService.jsx';

/**
 * Controller xử lý logic nghiệp vụ liên quan đến nhóm
 */
const nhomController = {
  /**
   * Lấy tất cả nhóm
   * @returns {Promise<Array>} Danh sách nhóm
   */
  getAllNhom: async () => {
    try {
      console.log('Controller - getAllNhom called');
      console.log('nhomService object:', nhomService);
      
      if (!nhomService || typeof nhomService.getAllNhom !== 'function') {
        throw new Error('nhomService.getAllNhom is not a function');
      }
      
      const response = await nhomService.getAllNhom();
      return response;
    } catch (error) {
      console.error('Controller error - getAllNhom:', error);
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
      if (!id) {
        throw new Error('ID nhóm không được để trống');
      }

      const response = await nhomService.getNhomById(id);
      return response;
    } catch (error) {
      console.error('Controller error - getNhomById:', error);
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
      const response = await nhomService.getNhomBySinhVien(sinhVienId);
      return response;
    } catch (error) {
      console.error('Controller error - getNhomBySinhVien:', error);
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
      const response = await nhomService.getNhomByAccount(accountId);
      return response;
    } catch (error) {
      console.error('Controller error - getNhomByAccount:', error);
      throw error;
    }
  },

  /**
   * Lấy nhóm của người dùng hiện tại
   * @returns {Promise<Array>} Danh sách nhóm của người dùng hiện tại
   */
  getMyGroups: async () => {
    try {
      const response = await nhomService.getMyGroups();
      return response;
    } catch (error) {
      console.error('Controller error - getMyGroups:', error);
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
      const response = await nhomService.createNhom(nhomData);
      return response;
    } catch (error) {
      console.error('Controller error - createNhom:', error);
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
      if (!id) {
        throw new Error('ID nhóm không được để trống');
      }

      const response = await nhomService.deleteNhom(id);
      return response;
    } catch (error) {
      console.error('Controller error - deleteNhom:', error);
      throw error;
    }
  }
};

export default nhomController;