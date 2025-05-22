/**
 * Model đại diện cho một thành viên trong nhóm đăng ký đề tài
 */
class ThanhVienModel {
  constructor(data = {}) {
    this.hoTen = data.hoTen || '';
    this.maSinhVien = data.maSinhVien || '';
  }

  /**
   * Chuyển đối tượng thành JSON để gửi lên API
   * @returns {Object} Object JSON đại diện cho thành viên
   */
  toJSON() {
    return {
      hoTen: this.hoTen,
      maSinhVien: this.maSinhVien
    };
  }

  /**
   * Tạo đối tượng từ dữ liệu API
   * @param {Object} apiData Dữ liệu API 
   * @returns {ThanhVienModel} Đối tượng ThanhVienModel
   */
  static fromAPI(apiData) {
    if (!apiData) return new ThanhVienModel();
    
    return new ThanhVienModel({
      hoTen: apiData.hoTen || '',
      maSinhVien: apiData.maSinhVien || ''
    });
  }
}

export default ThanhVienModel;