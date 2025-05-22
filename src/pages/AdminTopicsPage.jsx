import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TopicCard from '../components/TopicCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import topicController from '../controllers/topicController';
import useAuth from '../hooks/useAuth';

/**
 * Component quản lý đề tài dành cho Admin
 */
const AdminTopicsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State cho danh sách đề tài
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // State cho form tạo/sửa đề tài
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    tenDeTai: '',
    moTa: '',
    soNhomToiDa: 3,
    soThanhVienToiThieu: 2,
    soThanhVienToiDa: 5
  });
  
  // Fetch đề tài khi component mount
  useEffect(() => {
    fetchTopics();
  }, []);
  
  // Hàm lấy danh sách đề tài
  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy đề tài của người tạo hiện tại nếu có nguoiTaoId
      const topics = currentUser?.id 
        ? await topicController.getTopicsByCreator(currentUser.id)
        : await topicController.getAllTopics();
        
      setTopics(topics);
    } catch (error) {
      setError('Không thể tải danh sách đề tài: ' + (error.message || ''));
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý khi xem chi tiết đề tài
  const handleViewDetails = (topicId) => {
    navigate(`/admin/topic/${topicId}`);
  };
  
  // Mở form tạo đề tài mới
  const handleCreateTopic = () => {
    setFormData({
      id: null, // Đảm bảo id là null
      tenDeTai: '',
      moTa: '',
      soNhomToiDa: 3,
      soThanhVienToiThieu: 2,
      soThanhVienToiDa: 5
    });
    setIsEditing(false);
    setIsFormOpen(true);
  };
  
  // Mở form sửa đề tài
  const handleEditTopic = async (topicId) => {
    try {
      setActionLoading(true);
      const topic = await topicController.getTopicById(topicId);
      
      setFormData({
        id: topic.id,
        tenDeTai: topic.tenDeTai,
        moTa: topic.moTa,
        soNhomToiDa: topic.soNhomToiDa,
        soThanhVienToiThieu: topic.soThanhVienToiThieu,
        soThanhVienToiDa: topic.soThanhVienToiDa
      });
      
      setIsEditing(true);
      setIsFormOpen(true);
    } catch (error) {
      setError('Không thể tải thông tin đề tài: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Xử lý khi xóa đề tài
  const handleDeleteTopic = async (topicId) => {
    try {
      setActionLoading(true);
      await topicController.deleteTopic(topicId);
      
      // Cập nhật danh sách sau khi xóa
      setTopics(topics.filter(topic => topic.id !== topicId));
      
      setActionSuccess('Xóa đề tài thành công!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      setError('Không thể xóa đề tài: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Xử lý khi thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Chuyển đổi số nếu cần
    const parsedValue = ['soNhomToiDa', 'soThanhVienToiThieu', 'soThanhVienToiDa'].includes(name)
      ? parseInt(value, 10)
      : value;
      
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };
  
  // Xử lý khi submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      if (isEditing) {
        // Cập nhật đề tài
        const updatedTopic = await topicController.updateTopic(formData.id, formData);
        
        // Cập nhật state
        setTopics(topics.map(topic => 
          topic.id === updatedTopic.id ? updatedTopic : topic
        ));
        
        setActionSuccess('Cập nhật đề tài thành công!');
      } else {
        // Thêm nguoiTaoId vào formData và đảm bảo không có id
        const newTopicData = {
          ...formData,
          nguoiTaoId: currentUser?.id || 1 // Đảm bảo luôn có nguoiTaoId
        };
        // Xóa id khi tạo mới
        delete newTopicData.id;
        
        // Tạo đề tài mới
        const newTopic = await topicController.createTopic(newTopicData);
        
        // Cập nhật state
        setTopics([...topics, newTopic]);
        
        setActionSuccess('Tạo đề tài mới thành công!');
      }
      
      // Đóng form và reset state
      setIsFormOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      setError(`Không thể ${isEditing ? 'cập nhật' : 'tạo'} đề tài: ` + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {actionLoading && <LoadingOverlay text="Đang xử lý..." />}
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Quản lý đề tài
            </h1>
            <Button 
              variant="primary"
              onClick={handleCreateTopic}
            >
              Tạo đề tài mới
            </Button>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Alert hiển thị lỗi */}
              {error && (
                <Alert
                  type="error"
                  message={error}
                  dismissible
                  onDismiss={() => setError(null)}
                  className="mb-6"
                />
              )}
              
              {/* Alert hiển thị thành công */}
              {actionSuccess && (
                <Alert
                  type="success"
                  message={actionSuccess}
                  dismissible
                  onDismiss={() => setActionSuccess(null)}
                  className="mb-6"
                />
              )}
              
              {/* Form tạo/sửa đề tài */}
              {isFormOpen && (
                <Card 
                  title={isEditing ? 'Chỉnh sửa đề tài' : 'Tạo đề tài mới'}
                  className="mb-8"
                >
                  <form onSubmit={handleFormSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tên đề tài <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tenDeTai"
                          value={formData.tenDeTai}
                          onChange={handleFormChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="moTa"
                          value={formData.moTa}
                          onChange={handleFormChange}
                          required
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Số nhóm tối đa
                          </label>
                          <input
                            type="number"
                            name="soNhomToiDa"
                            value={formData.soNhomToiDa}
                            onChange={handleFormChange}
                            min={1}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Số thành viên tối thiểu
                          </label>
                          <input
                            type="number"
                            name="soThanhVienToiThieu"
                            value={formData.soThanhVienToiThieu}
                            onChange={handleFormChange}
                            min={1}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Số thành viên tối đa
                          </label>
                          <input
                            type="number"
                            name="soThanhVienToiDa"
                            value={formData.soThanhVienToiDa}
                            onChange={handleFormChange}
                            min={formData.soThanhVienToiThieu || 1}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsFormOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                      >
                        {isEditing ? 'Cập nhật' : 'Tạo mới'}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
              
              {/* Hiển thị danh sách đề tài */}
              {loading ? (
                <div className="py-12">
                  <Spinner size="lg" text="Đang tải danh sách đề tài..." />
                </div>
              ) : topics.length === 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                  <p className="text-gray-500">Không có đề tài nào được tìm thấy</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {topics.map(topic => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditTopic}
                      onDelete={handleDeleteTopic}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTopicsPage;