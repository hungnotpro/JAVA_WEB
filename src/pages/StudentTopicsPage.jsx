import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TopicCard from '../components/TopicCard';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import topicController from '../controllers/topicController';
import useAuth from '../hooks/useAuth';

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
    }
  };
  
  // Xem chi tiết đề tài
  const handleViewDetails = (topicId) => {
    navigate(`/student/topics/${topicId}`);
  };
  
  // Đăng ký đề tài
  const handleRegister = async (topicId) => {
    try {
      setActionLoading(true);
      await topicController.registerTopic(topicId);
      
      // Refresh danh sách sau khi đăng ký
      await fetchTopics();
      
      setActionSuccess('Đăng ký đề tài thành công!');
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi đăng ký đề tài');
      console.error('Error registering for topic:', err);
    } finally {
      setActionLoading(false);
    }
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
                      onViewDetails={handleViewDetails}
                      onRegister={handleRegister}
                      onUnregister={handleUnregister}
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

export default StudentTopicsPage;