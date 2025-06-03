import nhomDangKyService from '../services/nhomDangKyService';
import NhomDangKyModel from '../models/NhomDangKyModel';
import ThanhVienModel from '../models/ThanhVienModel.js';

/**
 * Controller xử lý logic nghiệp vụ cho nhóm đăng ký đề tài
 */
const nhomDangKyController = {
  /**
   * Đăng ký nhóm mới
   * @param {Object} nhomData Dữ liệu nhóm đăng ký
   * @returns {Promise<Object>} Kết quả đăng ký
   */  dangKyNhom: async (nhomData) => {
    try {
      console.log('nhomDangKyController - Received data:', nhomData);

      // Tạo đối tượng model từ dữ liệu form
      const nhomModel = new NhomDangKyModel({
        emailNhomTruong: nhomData.emailNhomTruong,
        deTaiId: nhomData.deTaiId,
        thongTinNhomTruong: nhomData.thongTinNhomTruong,
        danhSachThanhVien: nhomData.danhSachThanhVien || []
      });

      console.log('nhomDangKyController - Created model:', nhomModel);

      // Kiểm tra dữ liệu trước khi gửi
      if (!nhomModel.emailNhomTruong) {
        throw new Error('Email nhóm trưởng không được để trống');
      }

      if (!nhomModel.deTaiId) {
        throw new Error('ID đề tài không được để trống');
      }

      if (!nhomModel.thongTinNhomTruong.hoTen) {
        throw new Error('Thông tin nhóm trưởng không đầy đủ');
      }      // Kiểm tra danh sách thành viên
      const uniqueMaSV = new Set();

      for (const thanhVien of nhomModel.danhSachThanhVien) {
        if (!thanhVien.hoTen || !thanhVien.maSinhVien) {
          throw new Error('Thông tin thành viên không đầy đủ');
        }

        if (uniqueMaSV.has(thanhVien.maSinhVien)) {
          throw new Error(`Mã sinh viên ${thanhVien.maSinhVien} bị trùng lặp`);
        }

        uniqueMaSV.add(thanhVien.maSinhVien);
      }// Gọi service để đăng ký nhóm
      const response = await nhomDangKyService.dangKyNhom(nhomModel.toJSON());
      
      // Xử lý response - service đã trả về result trực tiếp
      return response;
    } catch (error) {
      console.error('Controller error - dangKyNhom:', error);
      // Nếu error có response từ API, throw message từ response
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng ký nhóm thất bại');
      }
      throw error;
    }
  },

  /**
   * Lấy thông tin nhóm đang đăng ký
   * @param {number} deTaiId ID của đề tài
   * @returns {Promise<NhomDangKyModel>} Thông tin nhóm
   */
  layThongTinNhom: async (deTaiId) => {
    try {
      const response = await nhomDangKyService.layThongTinNhom(deTaiId);
      
      // Xử lý response
      if (response && response.code === 1000) {
        return NhomDangKyModel.fromAPI(response.result);
      } else {
        throw new Error(response.message || 'Lấy thông tin nhóm thất bại');
      }
    } catch (error) {
      console.error('Controller error - layThongTinNhom:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin nhóm
   * @param {number} nhomId ID của nhóm
   * @param {Object} nhomData Dữ liệu nhóm cập nhật
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  capNhatNhom: async (nhomId, nhomData) => {
    try {
      // Tương tự như dangKyNhom, thực hiện validate dữ liệu
      const nhomModel = new NhomDangKyModel(nhomData);
      
      // Gọi service để cập nhật nhóm
      const response = await nhomDangKyService.capNhatNhom(nhomId, nhomModel.toJSON());
      
      // Xử lý response
      if (response && response.code === 1000) {
        return response.result;
      } else {
        throw new Error(response.message || 'Cập nhật nhóm thất bại');
      }
    } catch (error) {
      console.error('Controller error - capNhatNhom:', error);
      throw error;
    }
  },

  /**
   * Hủy đăng ký nhóm
   * @param {number} nhomId ID của nhóm cần hủy
   * @returns {Promise<Object>} Kết quả hủy đăng ký
   */
  huyDangKyNhom: async (nhomId) => {
    try {
      const response = await nhomDangKyService.huyDangKyNhom(nhomId);
      
      // Xử lý response
      if (response && response.code === 1000) {
        return response.result;
      } else {
        throw new Error(response.message || 'Hủy đăng ký nhóm thất bại');
      }
    } catch (error) {
      console.error('Controller error - huyDangKyNhom:', error);
      throw error;
    }
  }
};

export default nhomDangKyController;