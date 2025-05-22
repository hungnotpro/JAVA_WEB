import ThanhVienNhomModel from './ThanhVienNhomModel';

/**
 * Model đại diện cho một nhóm đăng ký đề tài
 */
class NhomModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tenDeTai = data.tenDeTai || '';
    this.emailNhomTruong = data.emailNhomTruong || '';
    this.thoiGianTao = data.thoiGianTao ? new Date(data.thoiGianTao) : null;
    this.deTaiId = data.deTaiId || null;
    this.thongTinNhomTruong = data.thongTinNhomTruong ? 
      new ThanhVienNhomModel(data.thongTinNhomTruong) : null;
    
    // Khởi tạo danh sách thành viên
    this.thanhVienNhoms = Array.isArray(data.thanhVienNhoms) 
      ? data.thanhVienNhoms.map(tv => new ThanhVienNhomModel(tv)) 
      : [];
    
    // Khởi tạo danh sách thành viên từ danhSachThanhVien nếu có
    if (Array.isArray(data.danhSachThanhVien)) {
      this.danhSachThanhVien = data.danhSachThanhVien.map(tv => new ThanhVienNhomModel(tv));
    } else {
      this.danhSachThanhVien = [];
    }
  }

  /**
   * Thêm thành viên vào nhóm
   * @param {ThanhVienNhomModel} thanhVien Thành viên cần thêm
   */
  addThanhVien(thanhVien) {
    if (thanhVien instanceof ThanhVienNhomModel) {
      this.thanhVienNhoms.push(thanhVien);
    } else {
      this.thanhVienNhoms.push(new ThanhVienNhomModel(thanhVien));
    }
  }

  /**
   * Xóa thành viên khỏi nhóm
   * @param {number} thanhVienId ID của thành viên cần xóa
   */
  removeThanhVien(thanhVienId) {
    this.thanhVienNhoms = this.thanhVienNhoms.filter(tv => tv.id !== thanhVienId);
  }

  /**
   * Kiểm tra xem nhóm có đủ thông tin cơ bản không
   * @returns {boolean} true nếu đủ thông tin
   */
  isValid() {
    return Boolean(
      this.emailNhomTruong && 
      this.deTaiId && 
      this.thongTinNhomTruong && 
      this.thongTinNhomTruong.isValid()
    );
  }

  /**
   * Chuyển đối tượng thành JSON để gửi lên API
   * @returns {Object} Object JSON đại diện cho nhóm
   */
  toJSON() {
    const result = {
      emailNhomTruong: this.emailNhomTruong,
      deTaiId: this.deTaiId
    };

    // Thêm các trường khác nếu có
    if (this.id) {
      result.id = this.id;
    }

    if (this.thongTinNhomTruong) {
      result.thongTinNhomTruong = this.thongTinNhomTruong.toJSON();
    }

    if (this.danhSachThanhVien && this.danhSachThanhVien.length > 0) {
      result.danhSachThanhVien = this.danhSachThanhVien.map(tv => tv.toJSON());
    }

    return result;
  }

  /**
   * Tạo đối tượng từ dữ liệu API
   * @param {Object} apiData Dữ liệu API 
   * @returns {NhomModel} Đối tượng NhomModel
   */
  static fromAPI(apiData) {
    if (!apiData) return new NhomModel();
    
    return new NhomModel({
      id: apiData.id,
      tenDeTai: apiData.tenDeTai,
      emailNhomTruong: apiData.emailNhomTruong,
      thoiGianTao: apiData.thoiGianTao,
      thanhVienNhoms: apiData.thanhVienNhoms || []
    });
  }
}

export default NhomModel;