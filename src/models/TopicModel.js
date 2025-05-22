/**
 * Topic Model
 * Represents the structure of a topic (đề tài)
 */
class TopicModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.lecturer = data.lecturer || '';
    this.maxStudents = data.maxStudents || 1;
    this.registeredStudents = data.registeredStudents || [];
    this.status = data.status || 'OPEN'; // 'OPEN', 'FULL', 'CLOSED'
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.deadline = data.deadline ? new Date(data.deadline) : null;
  }
  // Kiểm tra xem đề tài còn chỗ trống không
  hasAvailableSlots() {
    return (this.registeredStudents?.length || 0) < (this.maxStudents || 1);
  }

  // Kiểm tra xem đề tài có hết hạn chưa
  isExpired() {
    if (!this.deadline) return false;
    return new Date() > this.deadline;
  }

  // Kiểm tra xem sinh viên đã đăng ký đề tài này chưa
  isRegisteredBy(studentId) {
    if (!this.registeredStudents || !studentId) return false;
    return this.registeredStudents.some(student => student?.id === studentId);
  }

  // Factory method để tạo TopicModel từ dữ liệu API
  static fromAPI(apiData) {
    return new TopicModel({
      id: apiData.id,
      title: apiData.title,
      description: apiData.description,
      lecturer: apiData.lecturer,
      maxStudents: apiData.maxStudents,
      registeredStudents: apiData.registeredStudents || [],
      status: apiData.status,
      createdAt: apiData.createdAt,
      deadline: apiData.deadline
    });
  }

  // Chuyển đổi thành dữ liệu JSON để gửi lên API
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      lecturer: this.lecturer,
      maxStudents: this.maxStudents,
      status: this.status,
      deadline: this.deadline instanceof Date ? this.deadline.toISOString() : null
    };
  }
}

export default TopicModel;