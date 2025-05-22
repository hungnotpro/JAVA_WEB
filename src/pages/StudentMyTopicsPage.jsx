import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import nhomController from '../controllers/nhomController';
import useAuth from '../hooks/useAuth';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Component hiển thị danh sách nhóm đã đăng ký của sinh viên
 */
const StudentMyTopicsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State quản lý danh sách nhóm
  const [nhoms, setNhoms] = useState([]);
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
      
      // Fetch danh sách nhóm của người dùng hiện tại
      const nhomsData = await nhomController.getMyGroups();
      setNhoms(nhomsData);
    } catch (error) {
      setError('Không thể tải dữ liệu: ' + (error.message || ''));
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
    navigate(`/student/my-topics/${nhomId}`);
  };
  
  // Hủy đăng ký nhóm
  const handleCancelRegistration = async (nhomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký nhóm này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await nhomController.deleteNhom(nhomId);
      
      // Cập nhật danh sách sau khi xóa
      setNhoms(nhoms.filter(nhom => nhom.id !== nhomId));
      
      setActionSuccess('Hủy đăng ký nhóm thành công!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      setError('Không thể hủy đăng ký nhóm: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Kiểm tra người dùng hiện tại có phải là nhóm trưởng không
  const isGroupLeader = (nhom) => {
    return currentUser && currentUser.email === nhom.emailNhomTruong;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {actionLoading && <LoadingOverlay text="Đang xử lý..." />}
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Đề tài của tôi
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
                  <Spinner size="lg" text="Đang tải danh sách đề tài đã đăng ký..." />
                </div>
              ) : nhoms.length === 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-4">Bạn chưa đăng ký đề tài nào</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/student/topics')}
                  >
                    Xem danh sách đề tài
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {nhoms.map(nhom => (
                    <Card key={nhom.id}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="mb-4 md:mb-0 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {nhom.tenDeTai}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Email nhóm trưởng: {nhom.emailNhomTruong}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Đăng ký lúc: {formatDate(nhom.thoiGianTao)}
                          </p>
                          
                          {/* Hiển thị danh sách thành viên */}
                          {nhom.thanhVienNhoms && nhom.thanhVienNhoms.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Danh sách thành viên:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {nhom.thanhVienNhoms.map(tv => (
                                  <div key={tv.id} className="flex items-start">
                                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${tv.email === nhom.emailNhomTruong ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} text-xs font-medium mr-2`}>
                                      {tv.email === nhom.emailNhomTruong ? 'T' : (tv.id % 10)}
                                    </span>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{tv.hoTen}</p>
                                      <p className="text-xs text-gray-500">{tv.maSinhVien}</p>
                                      {tv.email && <p className="text-xs text-gray-500">{tv.email}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewDetails(nhom.id)}
                          >
                            Chi tiết
                          </Button>
                          
                          {isGroupLeader(nhom) && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleCancelRegistration(nhom.id)}
                            >
                              Hủy đăng ký
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
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

export default StudentMyTopicsPage;
