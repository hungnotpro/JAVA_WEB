/**
 * Topic Model
 * Represents the structure of a topic (đề tài)
 */
class TopicModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tenDeTai = data.tenDeTai || '';
    this.moTa = data.moTa || '';
    this.soNhomToiDa = data.soNhomToiDa || 1;
    this.soNhomDaDangKy = data.soNhomDaDangKy || 0;
    this.soThanhVienToiThieu = data.soThanhVienToiThieu || 1;
    this.soThanhVienToiDa = data.soThanhVienToiDa || 1;
    this.nguoiTaoId = data.nguoiTaoId || null;
    this.thoiGianTao = data.thoiGianTao ? new Date(data.thoiGianTao) : new Date();
    
    // Các trường bổ sung cho tương thích với mã cũ
    this.title = data.tenDeTai || data.title || '';
    this.description = data.moTa || data.description || '';
    this.status = this.calculateStatus();
  }  // Tính toán trạng thái của đề tài
  calculateStatus() {
    if (this.soNhomDaDangKy >= this.soNhomToiDa) {
      return 'FULL';
    }
    return 'OPEN';
  }

  // Kiểm tra xem đề tài còn chỗ trống không
  hasAvailableSlots() {
    return this.soNhomDaDangKy < this.soNhomToiDa;
  }
  // Kiểm tra xem sinh viên đã đăng ký đề tài này chưa
  isRegisteredBy(studentId) {
    // Không thể kiểm tra trực tiếp từ model, cần phải kiểm tra từ danh sách nhóm
    return false;
  }

  // Factory method để tạo TopicModel từ dữ liệu API
  static fromAPI(apiData) {
    return new TopicModel({
      id: apiData.id,
      tenDeTai: apiData.tenDeTai,
      moTa: apiData.moTa,
      soNhomToiDa: apiData.soNhomToiDa,
      soNhomDaDangKy: apiData.soNhomDaDangKy,
      soThanhVienToiThieu: apiData.soThanhVienToiThieu,
      soThanhVienToiDa: apiData.soThanhVienToiDa,
      nguoiTaoId: apiData.nguoiTaoId,
      thoiGianTao: apiData.thoiGianTao
    });
  }

  // Chuyển đổi thành dữ liệu JSON để gửi lên API
  toJSON() {
    return {
      id: this.id,
      tenDeTai: this.tenDeTai,
      moTa: this.moTa,
      soNhomToiDa: this.soNhomToiDa,
      soThanhVienToiThieu: this.soThanhVienToiThieu,
      soThanhVienToiDa: this.soThanhVienToiDa,
      nguoiTaoId: this.nguoiTaoId
    };
  }
}

export default TopicModel;