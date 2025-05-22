import nhomService from '../services/nhomService';
import NhomModel from '../models/NhomModel';
import ThanhVienNhomModel from '../models/ThanhVienNhomModel';

/**
 * Controller xử lý logic nghiệp vụ liên quan đến nhóm
 */
const nhomController = {
  /**
   * Lấy tất cả nhóm
   * @returns {Promise<Array<NhomModel>>} Danh sách nhóm
   */
  getAllNhom: async () => {
    try {
      const response = await nhomService.getAllNhom();
      return Array.isArray(response) 
        ? response.map(nhom => NhomModel.fromAPI(nhom)) 
        : [];
    } catch (error) {
      console.error('Controller error - getAllNhom:', error);
      throw error;
    }
  },

  /**
   * Lấy nhóm theo ID
   * @param {number} id ID của nhóm
   * @returns {Promise<NhomModel>} Thông tin nhóm
   */
  getNhomById: async (id) => {
    try {
      const response = await nhomService.getNhomById(id);
      return NhomModel.fromAPI(response);
    } catch (error) {
      console.error(`Controller error - getNhomById(${id}):`, error);
      throw error;
    }
  },
  /**
   * Lấy nhóm theo sinh viên ID
   * @param {number} sinhVienId ID của sinh viên
   * @returns {Promise<Array<NhomModel>>} Danh sách nhóm
   */
  getNhomBySinhVien: async (sinhVienId) => {
    try {
      const response = await nhomService.getNhomBySinhVien(sinhVienId);
      return Array.isArray(response) 
        ? response.map(nhom => NhomModel.fromAPI(nhom)) 
        : [];
    } catch (error) {
      console.error(`Controller error - getNhomBySinhVien(${sinhVienId}):`, error);
      throw error;
    }
  },

  /**
   * Lấy nhóm của người dùng hiện tại
   * @returns {Promise<Array<NhomModel>>} Danh sách nhóm của người dùng hiện tại
   */
  getMyGroups: async () => {
    try {
      const response = await nhomService.getMyGroups();
      return Array.isArray(response) 
        ? response.map(nhom => NhomModel.fromAPI(nhom)) 
        : [];
    } catch (error) {
      console.error('Controller error - getMyGroups:', error);
      throw error;
    }
  },

  /**
   * Tạo nhóm mới
   * @param {Object} nhomData Thông tin nhóm
   * @returns {Promise<NhomModel>} Thông tin nhóm đã tạo
   */
  createNhom: async (nhomData) => {
    try {
      // Tạo model và validate dữ liệu
      const nhomModel = new NhomModel(nhomData);
      
      if (!nhomModel.isValid()) {
        throw new Error('Thông tin nhóm không hợp lệ. Vui lòng kiểm tra lại.');
      }
      
      // Validate các thành viên trong nhóm
      if (nhomModel.danhSachThanhVien) {
        const invalidMembers = nhomModel.danhSachThanhVien.filter(tv => !tv.isValid());
        if (invalidMembers.length > 0) {
          throw new Error('Thông tin thành viên không hợp lệ. Vui lòng kiểm tra lại.');
        }
      }
      
      // Kiểm tra trùng lặp mã sinh viên
      if (nhomModel.danhSachThanhVien && nhomModel.danhSachThanhVien.length > 0) {
        const maSinhVienSet = new Set();
        const duplicateMaSV = [];
        
        // Kiểm tra mã sinh viên của nhóm trưởng
        if (nhomModel.thongTinNhomTruong) {
          maSinhVienSet.add(nhomModel.thongTinNhomTruong.maSinhVien);
        }
        
        // Kiểm tra mã sinh viên của thành viên
        nhomModel.danhSachThanhVien.forEach(tv => {
          if (maSinhVienSet.has(tv.maSinhVien)) {
            duplicateMaSV.push(tv.maSinhVien);
          } else {
            maSinhVienSet.add(tv.maSinhVien);
          }
        });
        
        if (duplicateMaSV.length > 0) {
          throw new Error(`Mã sinh viên trùng lặp: ${duplicateMaSV.join(', ')}`);
        }
      }

      // Gọi service để tạo nhóm
      const response = await nhomService.createNhom(nhomModel.toJSON());
      
      // Trả về model từ response
      return NhomModel.fromAPI(response);
    } catch (error) {
      console.error('Controller error - createNhom:', error);
      throw error;
    }
  },

  /**
   * Xóa nhóm
   * @param {number} id ID của nhóm
   * @returns {Promise<boolean>} true nếu xóa thành công
   */
  deleteNhom: async (id) => {
    try {
      await nhomService.deleteNhom(id);
      return true;
    } catch (error) {
      console.error(`Controller error - deleteNhom(${id}):`, error);
      throw error;
    }
  }
};

export default nhomController;