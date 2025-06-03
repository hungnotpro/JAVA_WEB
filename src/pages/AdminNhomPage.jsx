import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import nhomController from '../controllers/nhomController';
import topicController from '../controllers/topicController';
import useAuth from '../hooks/useAuth';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Component quản lý nhóm cho admin
 */
const AdminNhomPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State quản lý danh sách nhóm
  const [nhoms, setNhoms] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Hàm fetch dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch danh sách đề tài để hiển thị tên đề tài
      const topicsData = await topicController.getAllTopics();
      setTopics(topicsData);
      
      // Fetch danh sách nhóm
      const nhomsData = await nhomController.getAllNhom();
      setNhoms(nhomsData);
    } catch (error) {
      setError('Không thể tải dữ liệu: ' + (error.message || ''));
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Tìm tên đề tài theo ID
  const getTopicName = (deTaiId) => {
    const topic = topics.find(t => t.id === deTaiId);
    return topic ? topic.tenDeTai : 'Không xác định';
  };
  
  // Định dạng thời gian
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };
  
  // Xem chi tiết nhóm
  const handleViewDetails = (nhomId) => {
    navigate(`/admin/nhom/${nhomId}`);
  };
  
  // Xóa nhóm
  const handleDeleteNhom = async (nhomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await nhomController.deleteNhom(nhomId);
      
      // Cập nhật danh sách sau khi xóa
      setNhoms(nhoms.filter(nhom => nhom.id !== nhomId));
      
      setActionSuccess('Xóa nhóm thành công!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      setError('Không thể xóa nhóm: ' + (error.message || ''));
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
              Quản lý nhóm
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
              
              {/* Hiển thị danh sách nhóm */}
              {loading ? (
                <div className="py-12">
                  <Spinner size="lg" text="Đang tải danh sách nhóm..." />
                </div>
              ) : nhoms.length === 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  <p className="text-gray-500">Không có nhóm nào được tìm thấy</p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    {nhoms.map(nhom => (
                      <div key={nhom.id} className="px-4 py-5 sm:p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-gray-900">
                              {nhom.tenDeTai || getTopicName(nhom.deTaiId)}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Nhóm trưởng: {nhom.emailNhomTruong}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Thời gian tạo: {formatDate(nhom.thoiGianTao)}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Số thành viên: {nhom.thanhVienNhoms?.length || 0}
                            </p>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewDetails(nhom.id)}
                            >
                              Chi tiết
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteNhom(nhom.id)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                        
                        {/* Hiển thị danh sách thành viên */}
                        {nhom.thanhVienNhoms && nhom.thanhVienNhoms.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Danh sách thành viên:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                              {nhom.thanhVienNhoms.map(tv => (
                                <li key={tv.id}>
                                  {tv.hoTen} ({tv.maSinhVien})
                                  {tv.email && ` - ${tv.email}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNhomPage;