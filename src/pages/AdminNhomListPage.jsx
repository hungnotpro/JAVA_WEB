import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import nhomController from '../controllers/nhomController';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Component hiển thị tất cả các nhóm đã đăng ký cho Admin
 */
const AdminNhomListPage = () => {
  const navigate = useNavigate();

  // State quản lý dữ liệu
  const [nhoms, setNhoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // State cho search và filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNhoms, setFilteredNhoms] = useState([]);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchAllGroups();
  }, []);

  // Filter nhóm khi search term thay đổi
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNhoms(nhoms);
    } else {
      const filtered = nhoms.filter(nhom => 
        nhom.tenDeTai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nhom.emailNhomTruong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nhom.thanhVienNhoms.some(tv => 
          tv.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tv.maSinhVien.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredNhoms(filtered);
    }
  }, [searchTerm, nhoms]);

  // Hàm fetch tất cả nhóm
  const fetchAllGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await nhomController.getAllNhom();
      setNhoms(data);
      setFilteredNhoms(data);
    } catch (error) {
      setError('Không thể tải danh sách nhóm: ' + (error.message || ''));
      console.error('Error fetching groups:', error);
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

  // Xử lý search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xem chi tiết nhóm
  const handleViewDetail = (nhomId) => {
    navigate(`/admin/nhom/${nhomId}`);
  };

  // Xóa nhóm
  const handleDeleteGroup = async (nhom) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${nhom.tenDeTai}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      setActionLoading(true);
      await nhomController.deleteNhom(nhom.id);
      
      setActionSuccess(`Đã xóa nhóm "${nhom.tenDeTai}" thành công!`);
      await fetchAllGroups(); // Reload data

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Không thể xóa nhóm: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Spinner size="lg" text="Đang tải danh sách nhóm..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        {/* Header */}
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  Quản lý nhóm đăng ký
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Tổng số nhóm: <span className="font-medium">{nhoms.length}</span> |
                  Đang hiển thị: <span className="font-medium">{filteredNhoms.length}</span>
                </p>
              </div>
              
              <Button
                variant="primary"
                onClick={() => fetchAllGroups()}
                disabled={actionLoading}
              >
                🔄 Làm mới
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
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

              {/* Search */}
              <Card className="mb-6">
                <div className="px-6 py-4">
                  <div className="max-w-md">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                      Tìm kiếm nhóm
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Tìm theo tên đề tài, email nhóm trưởng, tên thành viên..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </Card>

              {/* Danh sách nhóm */}
              {filteredNhoms.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? 'Không tìm thấy nhóm phù hợp' : 'Chưa có nhóm nào đăng ký'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? 'Thử thay đổi từ khóa tìm kiếm' 
                        : 'Các nhóm đăng ký sẽ được hiển thị ở đây'
                      }
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredNhoms.map((nhom) => (
                    <Card key={nhom.id}>
                      <div className="px-6 py-4">
                        {/* Header nhóm */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {nhom.tenDeTai}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-500">Nhóm trưởng:</span>
                                <p className="text-gray-900">{nhom.emailNhomTruong}</p>
                              </div>
                              
                              <div>
                                <span className="font-medium text-gray-500">Thời gian đăng ký:</span>
                                <p className="text-gray-900">{formatDate(nhom.thoiGianTao)}</p>
                              </div>
                              
                              <div>
                                <span className="font-medium text-gray-500">Số thành viên:</span>
                                <p className="text-gray-900">
                                  {nhom.thanhVienNhoms?.length || 0} người
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewDetail(nhom.id)}
                            >
                              Xem chi tiết
                            </Button>
                            
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteGroup(nhom)}
                              disabled={actionLoading}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                        
                        {/* Danh sách thành viên */}
                        {nhom.thanhVienNhoms && nhom.thanhVienNhoms.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Danh sách thành viên:
                            </h4>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      STT
                                    </th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Họ tên
                                    </th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Mã sinh viên
                                    </th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Email
                                    </th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Vai trò
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {nhom.thanhVienNhoms.map((thanhVien, index) => (
                                    <tr key={thanhVien.id} className="border-b border-gray-100">
                                      <td className="py-2 px-3 text-sm text-gray-500">
                                        {index + 1}
                                      </td>
                                      <td className="py-2 px-3 text-sm font-medium text-gray-900">
                                        {thanhVien.hoTen}
                                      </td>
                                      <td className="py-2 px-3 text-sm text-gray-500">
                                        {thanhVien.maSinhVien}
                                      </td>
                                      <td className="py-2 px-3 text-sm text-gray-500">
                                        {thanhVien.email || '-'}
                                      </td>
                                      <td className="py-2 px-3 text-sm">
                                        {thanhVien.email === nhom.emailNhomTruong ? (
                                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Nhóm trưởng
                                          </span>
                                        ) : (
                                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Thành viên
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
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

export default AdminNhomListPage;