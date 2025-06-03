import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import TopicRegistrationInfo from '../components/TopicRegistrationInfo';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import topicController from '../controllers/topicController';
import { formatDate } from '../utils/formatters';

/**
 * Trang hiển thị chi tiết của một đề tài
 */
const TopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch thông tin đề tài khi component mount
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const topicData = await topicController.getTopicById(topicId);
        setTopic(topicData);
      } catch (err) {
        console.error('Error fetching topic:', err);
        setError(err.message || 'Không thể tải thông tin đề tài');
      } finally {
        setLoading(false);
      }
    };
    
    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);
    // Xử lý khi người dùng muốn đăng ký đề tài
  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/student/login', { state: { from: `/topics/${topicId}` } });
      return;
    }
    
    navigate(`/student/topics/dang-ky/${topicId}`);
  };
  
  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 flex justify-center">
            <Spinner size="lg" text="Đang tải thông tin đề tài..." />
          </div>
        </div>
      </div>
    );
  }
  
  // Hiển thị lỗi
  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Alert type="error" message={error || 'Không tìm thấy thông tin đề tài'} />
            <div className="mt-4">
              <Button onClick={() => navigate('/topics')} variant="secondary">
                Quay lại danh sách đề tài
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết đề tài</h1>
              <Button 
                onClick={() => navigate('/topics')} 
                variant="secondary"
              >
                Quay lại
              </Button>
            </div>
            
            <Card className="mb-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-medium leading-6 text-gray-900">
                    {topic.tenDeTai}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Thời gian tạo: {formatDate(topic.thoiGianTao)}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Mô tả đề tài</h3>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {topic.moTa}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin đăng ký</h3>
                    <TopicRegistrationInfo topic={topic} />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Đăng ký đề tài</h3>
                    
                    {topic.status === 'FULL' ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Đã đủ số nhóm
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>
                                Đề tài đã đạt số lượng nhóm tối đa ({topic.soNhomToiDa}). 
                                Vui lòng chọn đề tài khác.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            Yêu cầu số thành viên: <span className="font-medium">{topic.soThanhVienToiThieu} - {topic.soThanhVienToiDa}</span> người
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Còn <span className="font-medium">{topic.soNhomToiDa - topic.soNhomDaDangKy}</span> slot nhóm có thể đăng ký
                          </p>
                        </div>
                          <Button 
                          variant="primary" 
                          fullWidth 
                          onClick={handleRegister}
                        >
                          Đăng ký nhóm
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicDetailPage;