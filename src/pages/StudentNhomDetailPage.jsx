import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
 * Component hiển thị chi tiết nhóm đã đăng ký của sinh viên
 */
const StudentNhomDetailPage = () => {
  const { nhomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State quản lý thông tin nhóm và thành viên
  const [nhom, setNhom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Fetch dữ liệu khi component mount
  useEffect(() => {
    if (nhomId) {
      fetchData();
    }
  }, [nhomId]);
  
  // Hàm fetch dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch thông tin nhóm
      const nhomData = await nhomController.getNhomById(nhomId);
      setNhom(nhomData);
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
  
  // Hủy đăng ký nhóm
  const handleCancelRegistration = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký nhóm này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await nhomController.deleteNhom(nhomId);
      
      setActionSuccess('Hủy đăng ký nhóm thành công!');
      setTimeout(() => {
        navigate('/student/my-topics');
      }, 2000);
    } catch (error) {
      setError('Không thể hủy đăng ký nhóm: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Kiểm tra người dùng hiện tại có phải là nhóm trưởng không
  const isGroupLeader = () => {
    return currentUser && currentUser.email === nhom?.emailNhomTruong;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {actionLoading && <LoadingOverlay text="Đang xử lý..." />}
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Chi tiết nhóm
              </h1>
              {nhom && (
                <p className="mt-1 text-sm text-gray-500">
                  ID: {nhom.id}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/student/my-topics')}
            >
              Quay lại
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
              
              {loading ? (
                <div className="py-12">
                  <Spinner size="lg" text="Đang tải thông tin nhóm..." />
                </div>
              ) : !nhom ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  <p className="text-gray-500">Không tìm thấy thông tin nhóm</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Thông tin đề tài */}
                  <Card title="Thông tin đề tài">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{nhom.tenDeTai}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email nhóm trưởng</h4>
                          <p className="mt-1">{nhom.emailNhomTruong}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Thời gian đăng ký</h4>
                          <p className="mt-1">{formatDate(nhom.thoiGianTao)}</p>
                        </div>
                      </div>
                      
                      {isGroupLeader() && (
                        <div className="mt-6 flex justify-end">
                          <Button
                            variant="danger"
                            onClick={handleCancelRegistration}
                          >
                            Hủy đăng ký nhóm
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  {/* Danh sách thành viên */}
                  <Card title="Danh sách thành viên">
                    {!nhom.thanhVienNhoms || nhom.thanhVienNhoms.length === 0 ? (
                      <p className="text-gray-500">Chưa có thông tin thành viên</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Họ tên
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã sinh viên
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vai trò
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {nhom.thanhVienNhoms.map((thanhVien, index) => (
                              <tr key={thanhVien.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {thanhVien.hoTen}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {thanhVien.maSinhVien}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {thanhVien.email || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {thanhVien.email === nhom.emailNhomTruong ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Nhóm trưởng
                                    </span>
                                  ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                      Thành viên
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentNhomDetailPage;