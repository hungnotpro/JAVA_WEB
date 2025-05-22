import topicService from '../services/topicService';
import TopicModel from '../models/TopicModel';

/**
 * Controller cho việc quản lý đề tài
 * Xử lý logic nghiệp vụ trước khi gọi services
 */
const topicController = {
  /**
   * Lấy danh sách tất cả các đề tài
   * @returns {Promise<Array<TopicModel>>} Danh sách đề tài
   */
  async getAllTopics() {
    try {
      const topics = await topicService.getAllTopics();
      return topics;
    } catch (error) {
      console.error('Error in getAllTopics controller:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một đề tài
   * @param {string|number} id ID của đề tài
   * @returns {Promise<TopicModel>} Thông tin đề tài
   */
  async getTopicById(id) {
    if (!id) {
      throw new Error('ID đề tài không được để trống');
    }

    try {
      const topic = await topicService.getTopicById(id);
      return topic;
    } catch (error) {
      console.error(`Error in getTopicById controller for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo đề tài mới (Admin)
   * @param {Object} topicData Dữ liệu đề tài mới
   * @returns {Promise<TopicModel>} Đề tài đã tạo
   */
  async createTopic(topicData) {
    // Kiểm tra dữ liệu đầu vào
    if (!topicData.title || !topicData.title.trim()) {
      throw new Error('Tiêu đề đề tài không được để trống');
    }

    if (!topicData.lecturer || !topicData.lecturer.trim()) {
      throw new Error('Tên giảng viên hướng dẫn không được để trống');
    }

    try {
      // Chuyển đổi thành model trước khi gửi đi
      const topicModel = new TopicModel(topicData);
      const createdTopic = await topicService.createTopic(topicModel.toJSON());
      return createdTopic;
    } catch (error) {
      console.error('Error in createTopic controller:', error);
      throw error;
    }
  },

  /**
   * Cập nhật đề tài (Admin)
   * @param {string|number} id ID của đề tài
   * @param {Object} topicData Dữ liệu đề tài cần cập nhật
   * @returns {Promise<TopicModel>} Đề tài đã cập nhật
   */
  async updateTopic(id, topicData) {
    if (!id) {
      throw new Error('ID đề tài không được để trống');
    }

    // Kiểm tra dữ liệu đầu vào
    if (topicData.title && !topicData.title.trim()) {
      throw new Error('Tiêu đề đề tài không được để trống');
    }

    try {
      // Lấy thông tin đề tài hiện tại
      const currentTopic = await this.getTopicById(id);
      
      // Kết hợp dữ liệu hiện tại với dữ liệu mới
      const updatedData = {...currentTopic, ...topicData};
      
      // Chuyển đổi thành model trước khi gửi đi
      const topicModel = new TopicModel(updatedData);
      const updatedTopic = await topicService.updateTopic(id, topicModel.toJSON());
      return updatedTopic;
    } catch (error) {
      console.error(`Error in updateTopic controller for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa đề tài (Admin)
   * @param {string|number} id ID của đề tài
   * @returns {Promise<boolean>} Kết quả xóa
   */
  async deleteTopic(id) {
    if (!id) {
      throw new Error('ID đề tài không được để trống');
    }

    try {
      // Kiểm tra xem đề tài có tồn tại không
      await this.getTopicById(id);
      
      // Xóa đề tài
      const result = await topicService.deleteTopic(id);
      return result;
    } catch (error) {
      console.error(`Error in deleteTopic controller for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Đăng ký đề tài (Student)
   * @param {string|number} topicId ID của đề tài
   * @returns {Promise<Object>} Kết quả đăng ký
   */
  async registerTopic(topicId) {
    if (!topicId) {
      throw new Error('ID đề tài không được để trống');
    }

    try {
      // Kiểm tra thông tin đề tài trước khi đăng ký
      const topic = await this.getTopicById(topicId);
      
      // Kiểm tra xem đề tài còn slot không
      if (!topic.hasAvailableSlots()) {
        throw new Error('Đề tài đã đủ số lượng sinh viên đăng ký');
      }
      
      // Kiểm tra deadline
      if (topic.isExpired()) {
        throw new Error('Đã hết hạn đăng ký đề tài');
      }
      
      // Đăng ký đề tài
      const result = await topicService.registerTopic(topicId);
      return result;
    } catch (error) {
      console.error(`Error in registerTopic controller for ID ${topicId}:`, error);
      throw error;
    }
  },

  /**
   * Hủy đăng ký đề tài (Student)
   * @param {string|number} topicId ID của đề tài
   * @returns {Promise<Object>} Kết quả hủy đăng ký
   */
  async unregisterTopic(topicId) {
    if (!topicId) {
      throw new Error('ID đề tài không được để trống');
    }

    try {
      // Hủy đăng ký đề tài
      const result = await topicService.unregisterTopic(topicId);
      return result;
    } catch (error) {
      console.error(`Error in unregisterTopic controller for ID ${topicId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách đề tài đã đăng ký của sinh viên
   * @returns {Promise<Array<TopicModel>>} Danh sách đề tài đã đăng ký
   */
  async getStudentTopics() {
    try {
      const topics = await topicService.getStudentTopics();
      return topics;
    } catch (error) {
      console.error('Error in getStudentTopics controller:', error);
      throw error;
    }
  }
};

export default topicController;