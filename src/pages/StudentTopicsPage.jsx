import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import topicController from '../controllers/topicController';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';

const StudentTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch topics khi component mount
  useEffect(() => {
    fetchTopics();
  }, []);
  
  // Hàm fetch topics
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
    }  };
  
  // Đăng ký đề tài - Chuyển hướng đến trang đăng ký nhóm
  const handleRegister = (topicId) => {
    navigate(`/student/topics/dang-ky/${topicId}`);
  };
  
  // Hủy đăng ký đề tài
  const handleUnregister = async (topicId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký đề tài này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await topicController.unregisterTopic(topicId);
      
      // Refresh danh sách sau khi hủy đăng ký
      await fetchTopics();
      
      setActionSuccess('Hủy đăng ký đề tài thành công!');
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi hủy đăng ký đề tài');
      console.error('Error unregistering from topic:', err);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Component TopicCard inline để tùy chỉnh nút
  const TopicCard = ({ topic }) => {
    const isAvailable = topic.soNhomDaDangKy < topic.soNhomToiDa;
    
    return (
      <Card className="h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {topic.tenDeTai}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {topic.moTa}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Số nhóm:</p>
                <p className="text-sm font-medium">
                  {topic.soNhomDaDangKy} / {topic.soNhomToiDa}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Thành viên:</p>
                <p className="text-sm font-medium">
                  {topic.soThanhVienToiThieu} - {topic.soThanhVienToiDa}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500">Thời gian tạo:</p>
              <p className="text-sm">{formatDate(topic.thoiGianTao)}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-auto">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => navigate(`/topics/${topic.id}`)}
            >
              Xem chi tiết
            </Button>
            
            {isAvailable ? (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => handleRegister(topic.id)}
              >
                Đăng ký
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                disabled
              >
                Đã đầy
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {actionLoading && <LoadingOverlay text="Đang xử lý..." />}
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Danh sách đề tài
            </h1>
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
                />
              )}
              
              {/* Alert hiển thị thành công */}
              {actionSuccess && (
                <Alert
                  type="success"
                  message={actionSuccess}
                  dismissible
                  onDismiss={() => setActionSuccess(null)}
                />
              )}
              
              {/* Hiển thị loading */}
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

export default StudentTopicsPage;