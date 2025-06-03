import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import topicController from '../controllers/topicController';
import { formatDate } from '../utils/formatters';

/**
 * Trang hiển thị chi tiết đề tài (dành cho admin)
 */
const AdminTopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy thông tin chi tiết đề tài khi component mount
  useEffect(() => {
    const fetchTopicDetail = async () => {
      try {
        setLoading(true);
        const data = await topicController.getTopicById(topicId);
        setTopic(data);
      } catch (err) {
        console.error('Error fetching topic details:', err);
        setError(err.message || 'Không thể tải thông tin chi tiết đề tài');
      } finally {
        setLoading(false);
      }
    };
    
    if (topicId) {
      fetchTopicDetail();
    }
  }, [topicId]);
  
  const handleBack = () => {
    navigate('/admin/topics');
  };
    const handleEdit = () => {
    // Chuyển đến trang chỉnh sửa đề tài
    navigate(`/admin/topics/edit/${topicId}`);
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đề tài này?')) {
      return;
    }
    
    try {
      await topicController.deleteTopic(topicId);
      // Quay lại trang danh sách đề tài sau khi xóa thành công
      navigate('/admin/topics', { replace: true });
    } catch (err) {
      console.error('Error deleting topic:', err);
      setError(err.message || 'Đã xảy ra lỗi khi xóa đề tài');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 flex justify-center">
            <Spinner size="lg" text="Đang tải thông tin đề tài..." />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Alert type="error" message={error} />
            <div className="mt-4">
              <Button variant="secondary" onClick={handleBack}>
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Alert type="warning" message="Không tìm thấy thông tin đề tài" />
            <div className="mt-4">
              <Button variant="secondary" onClick={handleBack}>
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Chi tiết đề tài
              </h1>
              <Button variant="secondary" onClick={handleBack}>
                Quay lại
              </Button>
            </div>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Thông tin chính của đề tài */}
              <Card className="mb-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{topic.tenDeTai}</h3>
                    <p className="mt-1 text-sm text-gray-500">ID: {topic.id}</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex space-x-3">
                    <Button variant="secondary" onClick={handleEdit}>
                      Chỉnh sửa
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Xóa đề tài
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mô tả đề tài</h4>
                    <p className="mt-2 text-sm text-gray-900 whitespace-pre-line">{topic.moTa}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Thông tin số lượng</h4>
                      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                          <dt className="text-sm text-gray-500">Số nhóm tối đa</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">{topic.soNhomToiDa}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Số nhóm đã đăng ký</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">{topic.soNhomDaDangKy}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Số thành viên tối thiểu</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">{topic.soThanhVienToiThieu}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Số thành viên tối đa</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">{topic.soThanhVienToiDa}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Thông tin khác</h4>
                      <dl className="mt-2 grid grid-cols-1 gap-y-4">
                        <div>
                          <dt className="text-sm text-gray-500">Người tạo ID</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">{topic.nguoiTaoId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Thời gian tạo</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">{formatDate(topic.thoiGianTao)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Danh sách nhóm đăng ký đề tài */}
              <Card title="Danh sách nhóm đã đăng ký" className="mb-6">
                {topic.soNhomDaDangKy > 0 ? (
                  <div className="overflow-x-auto">
                    <p className="py-4 text-sm text-gray-500">
                      Tính năng xem danh sách nhóm đã đăng ký sẽ được phát triển sau.
                    </p>
                  </div>
                ) : (
                  <p className="py-4 text-sm text-gray-500">Chưa có nhóm nào đăng ký đề tài này</p>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTopicDetailPage;