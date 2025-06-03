import apiClient from '../utils/apiClient';
import TopicModel from '../models/TopicModel';

/**
 * Controller xử lý các thao tác liên quan đến đề tài
 */
const topicController = {
  /**
   * Lấy tất cả đề tài
   * @returns {Promise<Array<TopicModel>>} Danh sách đề tài
   */
  getAllTopics: async () => {
    try {
      const response = await apiClient.get('/topic');
      
      if (response.data && response.data.code === 1000) {
        return response.data.result.map(topic => TopicModel.fromAPI(topic));
      } else {
        throw new Error(response.data?.message || 'Không thể lấy danh sách đề tài');
      }
    } catch (error) {
      console.error('Controller error - getAllTopics:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi lấy danh sách đề tài');
      }
      throw error;
    }
  },

  /**
   * Lấy thông tin đề tài theo ID
   * @param {number} topicId ID của đề tài
   * @returns {Promise<TopicModel>} Thông tin đề tài
   */
  getTopicById: async (topicId) => {
    try {
      const response = await apiClient.get(`/topic/${topicId}`);
      
      if (response.data && response.data.code === 1000) {
        return TopicModel.fromAPI(response.data.result);
      } else {
        throw new Error(response.data?.message || 'Không thể lấy thông tin đề tài');
      }
    } catch (error) {
      console.error(`Controller error - getTopicById(${topicId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi lấy thông tin đề tài');
      }
      throw error;
    }
  },

  /**
   * Tạo đề tài mới (dành cho admin)
   * @param {Object} topicData Thông tin đề tài
   * @returns {Promise<TopicModel>} Đề tài đã tạo
   */
  createTopic: async (topicData) => {
    try {
      const response = await apiClient.post('/topic', topicData);
      
      if (response.data && response.data.code === 1000) {
        return TopicModel.fromAPI(response.data.result);
      } else {
        throw new Error(response.data?.message || 'Không thể tạo đề tài');
      }
    } catch (error) {
      console.error('Controller error - createTopic:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi tạo đề tài');
      }
      throw error;
    }
  },

  /**
   * Cập nhật đề tài (dành cho admin)
   * @param {number} topicId ID của đề tài
   * @param {Object} topicData Thông tin cập nhật
   * @returns {Promise<TopicModel>} Đề tài đã cập nhật
   */
  updateTopic: async (topicId, topicData) => {
    try {
      const response = await apiClient.put(`/topic/${topicId}`, topicData);
      
      if (response.data && response.data.code === 1000) {
        return TopicModel.fromAPI(response.data.result);
      } else {
        throw new Error(response.data?.message || 'Không thể cập nhật đề tài');
      }
    } catch (error) {
      console.error(`Controller error - updateTopic(${topicId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi cập nhật đề tài');
      }
      throw error;
    }
  },

  /**
   * Xóa đề tài (dành cho admin)
   * @param {number} topicId ID của đề tài
   * @returns {Promise<boolean>} Kết quả xóa
   */
  deleteTopic: async (topicId) => {
    try {
      const response = await apiClient.delete(`/topic/${topicId}`);
      
      if (response.data && response.data.code === 1000) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Không thể xóa đề tài');
      }
    } catch (error) {
      console.error(`Controller error - deleteTopic(${topicId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi xóa đề tài');
      }
      throw error;
    }
  },

  /**
   * Hủy đăng ký đề tài (dành cho sinh viên)
   * @param {number} topicId ID của đề tài
   * @returns {Promise<boolean>} Kết quả hủy đăng ký
   */
  unregisterTopic: async (topicId) => {
    try {
      const response = await apiClient.delete(`/group/topic/${topicId}/unregister`);
      
      if (response.data && response.data.code === 1000) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Không thể hủy đăng ký đề tài');
      }
    } catch (error) {
      console.error(`Controller error - unregisterTopic(${topicId}):`, error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi khi hủy đăng ký đề tài');
      }
      throw error;
    }
  }
};

export default topicController;