import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';
import Input from '../components/Input';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import topicController from '../controllers/topicController';
import { useAuth } from '../contexts/AuthContext';

const AddTopicForm = ({ onAddSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    tenDeTai: '',
    moTa: '',
    soNhomToiDa: 3,
    soThanhVienToiThieu: 2,
    soThanhVienToiDa: 5,
    nguoiTaoId: currentUser?.id || 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'soNhomToiDa' || name === 'soThanhVienToiThieu' || name === 'soThanhVienToiDa' 
        ? parseInt(value, 10) 
        : value
    });
  };

  const validateForm = () => {
    if (!formData.tenDeTai.trim()) {
      setError('Vui lòng nhập tên đề tài');
      return false;
    }
    
    if (!formData.moTa.trim()) {
      setError('Vui lòng nhập mô tả đề tài');
      return false;
    }
    
    if (formData.soNhomToiDa < 1) {
      setError('Số nhóm tối đa phải lớn hơn 0');
      return false;
    }
    
    if (formData.soThanhVienToiThieu < 1) {
      setError('Số thành viên tối thiểu phải lớn hơn 0');
      return false;
    }
    
    if (formData.soThanhVienToiDa < formData.soThanhVienToiThieu) {
      setError('Số thành viên tối đa phải lớn hơn hoặc bằng số thành viên tối thiểu');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await topicController.createTopic(formData);
      
      // Thông báo thành công và reset form
      onAddSuccess(result);
    } catch (err) {
      console.error('Error creating topic:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tạo đề tài');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Thêm đề tài mới">
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Tên đề tài"
            name="tenDeTai"
            value={formData.tenDeTai}
            onChange={handleChange}
            placeholder="Nhập tên đề tài"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả đề tài
            </label>
            <textarea
              name="moTa"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập mô tả chi tiết về đề tài"
              value={formData.moTa}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Số nhóm tối đa"
              name="soNhomToiDa"
              type="number"
              min={1}
              value={formData.soNhomToiDa}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Số thành viên tối thiểu"
              name="soThanhVienToiThieu"
              type="number"
              min={1}
              value={formData.soThanhVienToiThieu}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Số thành viên tối đa"
              name="soThanhVienToiDa"
              type="number"
              min={1}
              value={formData.soThanhVienToiDa}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Thêm đề tài
          </Button>
        </div>
      </form>
    </Card>
  );
};

const AdminTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTopics();
  }, []);
  
  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await topicController.getAllTopics();
      setTopics(data);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách đề tài');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTopicSuccess = (newTopic) => {
    setTopics([...topics, newTopic]);
    setShowAddForm(false);
    setSuccessMessage('Thêm đề tài thành công!');
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đề tài này?')) {
      return;
    }
    
    try {
      await topicController.deleteTopic(topicId);
      // Cập nhật lại danh sách đề tài sau khi xóa
      fetchTopics();
      setSuccessMessage('Xóa đề tài thành công!');
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi xóa đề tài');
      console.error('Error deleting topic:', err);
    }
  };
  
  const handleViewTopic = (topicId) => {
    navigate(`/admin/topics/${topicId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Quản lý đề tài
            </h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Hiển thị thông báo thành công */}
              {successMessage && (
                <Alert
                  type="success"
                  message={successMessage}
                  dismissible
                  onDismiss={() => setSuccessMessage(null)}
                  className="mb-4"
                />
              )}
              
              {/* Hiển thị thông báo lỗi */}
              {error && (
                <Alert
                  type="error"
                  message={error}
                  dismissible
                  onDismiss={() => setError(null)}
                  className="mb-4"
                />
              )}
              
              {/* Nút thêm đề tài mới */}
              {!showAddForm && (
                <div className="mb-6">
                  <Button
                    variant="primary"
                    onClick={() => setShowAddForm(true)}
                  >
                    + Thêm đề tài mới
                  </Button>
                </div>
              )}
              
              {/* Form thêm đề tài */}
              {showAddForm && (
                <div className="mb-6">
                  <AddTopicForm
                    onAddSuccess={handleAddTopicSuccess}
                    onCancel={() => setShowAddForm(false)}
                  />
                </div>
              )}
              
              {/* Danh sách đề tài */}
              <Card title="Danh sách đề tài">
                {loading ? (
                  <div className="py-12 flex justify-center">
                    <Spinner text="Đang tải danh sách đề tài..." />
                  </div>
                ) : topics.length === 0 ? (
                  <p className="py-4 text-gray-500 text-center">Chưa có đề tài nào</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên đề tài
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số nhóm
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số thành viên
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topics.map((topic) => (
                          <tr key={topic.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {topic.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {topic.tenDeTai}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {topic.moTa}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {topic.soNhomDaDangKy} / {topic.soNhomToiDa}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {topic.soThanhVienToiThieu} - {topic.soThanhVienToiDa}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleViewTopic(topic.id)}
                                >
                                  Xem
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteTopic(topic.id)}
                                >
                                  Xóa
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTopicsPage;