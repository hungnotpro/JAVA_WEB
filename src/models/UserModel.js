/**
 * User Model
 * Represents the structure of a user object
 */
class UserModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.role = data.role || ''; // 'ADMIN' or 'STUDENT'
    this.avatar = data.avatar || null;
  }  // Kiểm tra xem có phải admin không
  isAdmin() {
    return this.role === 'ADMIN' || this.role === 'admin';
  }

  // Kiểm tra xem có phải sinh viên không
  isStudent() {
    return this.role === 'STUDENT' || this.role === 'student' || this.role === 'SINH_VIEN';
  }
  // Factory method để tạo UserModel từ dữ liệu API
  static fromAPI(apiData) {
    if (!apiData) {
      console.error('UserModel.fromAPI called with null or undefined data');
      return new UserModel({});
    }
    return new UserModel({
      id: apiData.id,
      name: apiData.name || apiData.fullName || 'Unknown User',
      email: apiData.email || '',
      role: apiData.role || 'STUDENT',
      avatar: apiData.avatar || apiData.picture
    });
  }

  // Chuyển đổi thành dữ liệu JSON để lưu vào localStorage
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      avatar: this.avatar
    };
  }
}

export default UserModel;