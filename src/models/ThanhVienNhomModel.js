/**
 * Model đại diện cho một thành viên trong nhóm
 */
class ThanhVienNhomModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.hoTen = data.hoTen || '';
    this.maSinhVien = data.maSinhVien || '';
    this.email = data.email || null;
  }

  /**
   * Kiểm tra xem thông tin thành viên có hợp lệ không
   * @returns {boolean} true nếu thông tin hợp lệ
   */
  isValid() {
    return Boolean(this.hoTen && this.maSinhVien);
  }

  /**
   * Chuyển đối tượng thành JSON để gửi lên API
   * @returns {Object} Object JSON đại diện cho thành viên
   */
  toJSON() {
    const result = {
      hoTen: this.hoTen,
      maSinhVien: this.maSinhVien
    };

    // Thêm các trường khác nếu có
    if (this.id) {
      result.id = this.id;
    }

    if (this.email) {
      result.email = this.email;
    }

    return result;
  }

  /**
   * Tạo đối tượng từ dữ liệu API
   * @param {Object} apiData Dữ liệu API 
   * @returns {ThanhVienNhomModel} Đối tượng ThanhVienNhomModel
   */
  static fromAPI(apiData) {
    if (!apiData) return new ThanhVienNhomModel();
    
    return new ThanhVienNhomModel({
      id: apiData.id,
      hoTen: apiData.hoTen,
      maSinhVien: apiData.maSinhVien,
      email: apiData.email
    });
  }
}

export default ThanhVienNhomModel;