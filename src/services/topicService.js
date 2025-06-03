import apiClient from '../utils/apiClient';

/**
 * Service xử lý API liên quan đến đề tài
 */
const topicService = {
  /**
   * Lấy tất cả đề tài
   * @returns {Promise<Array>} Danh sách đề tài
   */
  getAllTopics: async () => {
    try {
      const response = await apiClient.get('/topic');
      return response.data.result;
    } catch (error) {
      console.error('Service error - getAllTopics:', error);
      throw error;
    }
  },

  /**
   * Lấy đề tài theo ID
   * @param {number} id ID của đề tài
   * @returns {Promise<Object>} Thông tin đề tài
   */
  getTopicById: async (id) => {
    try {
      const response = await apiClient.get(`/topic/${id}`);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - getTopicById(${id}):`, error);
      throw error;
    }
  },

  /**
   * Lấy đề tài theo người tạo
   * @param {number} creatorId ID của người tạo
   * @returns {Promise<Array>} Danh sách đề tài
   */
  getTopicsByCreator: async (creatorId) => {
    try {
      const response = await apiClient.get(`/topic/nguoi-tao/${creatorId}`);
      return response.data.result;
    } catch (error) {
      console.error(`Service error - getTopicsByCreator(${creatorId}):`, error);
      throw error;
    }
  },
  /**
   * Tạo đề tài mới
   * @param {Object} topicData Thông tin đề tài
   * @returns {Promise<Object>} Thông tin đề tài đã tạo
   */
  createTopic: async (topicData) => {
    try {
      // Chuẩn bị dữ liệu để gửi lên API
      const payload = {
        tenDeTai: topicData.tenDeTai,
        moTa: topicData.moTa,
        soNhomToiDa: topicData.soNhomToiDa,
        soThanhVienToiThieu: topicData.soThanhVienToiThieu,
        soThanhVienToiDa: topicData.soThanhVienToiDa,
        nguoiTaoId: topicData.nguoiTaoId || 1
      };
      
      const response = await apiClient.post('/topic', payload);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không thể tạo đề tài');
      }
    } catch (error) {
      console.error('Service error - createTopic:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi tạo đề tài');
      }
      throw error;
    }
  },
  /**
   * Cập nhật đề tài
   * @param {number} id ID của đề tài
   * @param {Object} topicData Thông tin đề tài cần cập nhật
   * @returns {Promise<Object>} Thông tin đề tài đã cập nhật
   */
  updateTopic: async (id, topicData) => {
    try {
      const response = await apiClient.put(`/topic/${id}`, topicData);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không thể cập nhật đề tài');
      }
    } catch (error) {
      console.error(`Service error - updateTopic(${id}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi cập nhật đề tài');
      }
      throw error;
    }
  },

  /**
   * Xóa đề tài
   * @param {number} id ID của đề tài
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteTopic: async (id) => {
    try {
      const response = await apiClient.delete(`/topic/${id}`);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Không thể xóa đề tài');
      }
    } catch (error) {
      console.error(`Service error - deleteTopic(${id}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi xóa đề tài');
      }
      throw error;
    }
  },  /**
   * Đăng ký đề tài
   * @param {Object} nhomData Dữ liệu nhóm
   * @returns {Promise<Object>} Kết quả đăng ký
   */
  registerTopic: async (nhomData) => {
    try {
      // Đảm bảo format dữ liệu đúng với API
      const requestData = {
        emailNhomTruong: nhomData.emailNhomTruong,
        deTaiId: nhomData.deTaiId,
        thongTinNhomTruong: {
          hoTen: nhomData.thongTinNhomTruong.hoTen
        },
        danhSachThanhVien: nhomData.danhSachThanhVien
      };
      
      // Gọi API tạo nhóm mới
      const response = await apiClient.post('/group', requestData);
      
      // Kiểm tra phản hồi từ API
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không thể đăng ký đề tài');
      }
    } catch (error) {
      console.error(`Service error - registerTopic:`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi đăng ký đề tài');
      }
      throw error;
    }
  },
  /**
   * Hủy đăng ký đề tài
   * @param {number} topicId ID của đề tài
   * @returns {Promise<Object>} Kết quả hủy đăng ký
   */
  unregisterTopic: async (topicId) => {
    try {
      // Lấy thông tin người dùng hiện tại
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }
      
      const user = JSON.parse(userJson);
      
      // Lấy danh sách nhóm của người dùng
      const response = await apiClient.get('/group/my-groups');
      const myGroups = response.data.result || [];
      
      // Tìm nhóm của đề tài cần hủy
      const targetGroup = myGroups.find(group => group.deTaiId === Number(topicId));
      
      if (!targetGroup) {
        throw new Error('Bạn chưa đăng ký đề tài này');
      }
      
      // Xóa nhóm (hủy đăng ký)
      const deleteResponse = await apiClient.delete(`/group/${targetGroup.id}`);
      return deleteResponse.data;
    } catch (error) {
      console.error(`Service error - unregisterTopic(${topicId}):`, error);
      throw error;
    }
  },
  /**
   * Lấy đề tài của sinh viên hiện tại
   * @returns {Promise<Array>} Danh sách đề tài
   */
  getStudentTopics: async () => {
    try {
      // Lấy ID từ user hiện tại thay vì gọi /topic/student
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }
      
      const user = JSON.parse(userJson);
      
      // Gọi API lấy danh sách tất cả đề tài
      const response = await apiClient.get('/topic');
      
      // Trả về tất cả đề tài (tạm thời, sau khi API được sửa)
      return response.data.result;
    } catch (error) {
      console.error('Service error - getStudentTopics:', error);
      throw error;
    }
  }
};

export default topicService;