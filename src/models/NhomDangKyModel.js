import ThanhVienModel from './ThanhVienModel';

/**
 * Model đại diện cho nhóm đăng ký đề tài
 */
class NhomDangKyModel {
  constructor(data = {}) {
    this.emailNhomTruong = data.emailNhomTruong || '';
    this.deTaiId = data.deTaiId || null;
    this.thongTinNhomTruong = data.thongTinNhomTruong ? 
      new ThanhVienModel(data.thongTinNhomTruong) : 
      new ThanhVienModel();
    this.danhSachThanhVien = Array.isArray(data.danhSachThanhVien) ? 
      data.danhSachThanhVien.map(tv => new ThanhVienModel(tv)) : 
      [];
  }

  /**
   * Thêm thành viên vào nhóm
   * @param {ThanhVienModel} thanhVien Thành viên cần thêm
   */
  addThanhVien(thanhVien) {
    if (thanhVien instanceof ThanhVienModel) {
      this.danhSachThanhVien.push(thanhVien);
    } else {
      this.danhSachThanhVien.push(new ThanhVienModel(thanhVien));
    }
  }

  /**
   * Xóa thành viên khỏi nhóm
   * @param {string} maSinhVien Mã sinh viên cần xóa
   */
  removeThanhVien(maSinhVien) {
    this.danhSachThanhVien = this.danhSachThanhVien.filter(
      tv => tv.maSinhVien !== maSinhVien
    );
  }

  /**
   * Chuyển đối tượng thành JSON để gửi lên API
   * @returns {Object} Object JSON đại diện cho nhóm đăng ký
   */
  toJSON() {
    return {
      emailNhomTruong: this.emailNhomTruong,
      deTaiId: this.deTaiId,
      thongTinNhomTruong: this.thongTinNhomTruong.toJSON(),
      danhSachThanhVien: this.danhSachThanhVien.map(tv => tv.toJSON())
    };
  }

  /**
   * Tạo đối tượng từ dữ liệu API
   * @param {Object} apiData Dữ liệu API 
   * @returns {NhomDangKyModel} Đối tượng NhomDangKyModel
   */
  static fromAPI(apiData) {
    if (!apiData) return new NhomDangKyModel();
    
    return new NhomDangKyModel({
      emailNhomTruong: apiData.emailNhomTruong || '',
      deTaiId: apiData.deTaiId || null,
      thongTinNhomTruong: apiData.thongTinNhomTruong || {},
      danhSachThanhVien: apiData.danhSachThanhVien || []
    });
  }
}

export default NhomDangKyModel;