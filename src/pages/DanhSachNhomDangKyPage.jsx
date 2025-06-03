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
 * Component hiển thị danh sách tất cả các nhóm đã đăng ký
 */
const DanhSachNhomDangKyPage = () => {
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
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchAllGroups();
  }, []);

  // Filter và sort nhóm khi search term hoặc sort thay đổi
  useEffect(() => {
    let filtered = nhoms;

    // Filter theo search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(nhom => 
        nhom.tenDeTai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nhom.emailNhomTruong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nhom.thanhVienNhoms.some(tv => 
          tv.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tv.maSinhVien.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort theo lựa chọn
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.thoiGianTao) - new Date(a.thoiGianTao));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.thoiGianTao) - new Date(b.thoiGianTao));
        break;
      case 'name':
        filtered.sort((a, b) => a.tenDeTai.localeCompare(b.tenDeTai));
        break;
    }

    setFilteredNhoms(filtered);
  }, [searchTerm, nhoms, sortBy]);

  // Hàm fetch tất cả nhóm
  const fetchAllGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await nhomController.getAllNhom();
      setNhoms(data);
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

  // Xử lý sort
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Xem chi tiết nhóm
  const handleViewDetail = (nhomId) => {
    navigate(`/admin/nhom/${nhomId}`);
  };

  // Xóa nhóm
  const handleDeleteGroup = async (nhom) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${nhom.tenDeTai}"?\n\nHành động này sẽ xóa vĩnh viễn:\n- Thông tin nhóm\n- Tất cả thành viên\n- Không thể hoàn tác`)) {
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

  // Tính toán thống kê
  const totalMembers = nhoms.reduce((sum, nhom) => sum + (nhom.thanhVienNhoms?.length || 0), 0);
  const avgMembersPerGroup = nhoms.length > 0 ? (totalMembers / nhoms.length).toFixed(1) : 0;

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Spinner size="lg" text="Đang tải danh sách nhóm đã đăng ký..." />
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
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  📋 Danh sách nhóm đã đăng ký
                </h1>
                <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="font-medium">Tổng số nhóm:</span>
                    <span className="ml-1 font-bold text-blue-600">{nhoms.length}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="font-medium">Tổng thành viên:</span>
                    <span className="ml-1 font-bold text-green-600">{totalMembers}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="font-medium">TB thành viên/nhóm:</span>
                    <span className="ml-1 font-bold text-purple-600">{avgMembersPerGroup}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="font-medium">Đang hiển thị:</span>
                    <span className="ml-1 font-bold text-orange-600">{filteredNhoms.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button
                  variant="primary"
                  onClick={() => fetchAllGroups()}
                  disabled={actionLoading}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Làm mới
                </Button>
              </div>
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

              {/* Bộ lọc và tìm kiếm */}
              <Card className="mb-6">
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        🔍 Tìm kiếm nhóm
                      </label>
                      <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Tìm theo tên đề tài, email nhóm trưởng, tên/MSSV thành viên..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Sort */}
                    <div>
                      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                        📊 Sắp xếp theo
                      </label>
                      <select
                        id="sort"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="name">Tên đề tài (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Danh sách nhóm */}
              {filteredNhoms.length === 0 ? (
                <Card>
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-8xl mb-6">
                      {searchTerm ? '🔍' : '📋'}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {searchTerm ? 'Không tìm thấy nhóm phù hợp' : 'Chưa có nhóm nào đăng ký'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' 
                        : 'Các nhóm đăng ký đề tài sẽ được hiển thị ở đây'
                      }
                    </p>
                    {searchTerm && (
                      <Button
                        variant="secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredNhoms.map((nhom, index) => (
                    <Card 
                      key={nhom.id}
                      className="transition-all duration-200 hover:shadow-lg border-l-4 border-l-blue-500"
                    >
                      <div className="px-6 py-4">
                        {/* Header nhóm */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                                    onClick={() => handleViewDetail(nhom.id)}>
                                  📚 {nhom.tenDeTai}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">👑</span>
                                    <div>
                                      <span className="font-medium text-gray-500">Nhóm trưởng:</span>
                                      <p className="text-gray-900 font-medium">{nhom.emailNhomTruong}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">⏰</span>
                                    <div>
                                      <span className="font-medium text-gray-500">Đăng ký lúc:</span>
                                      <p className="text-gray-900">{formatDate(nhom.thoiGianTao)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">👥</span>
                                    <div>
                                      <span className="font-medium text-gray-500">Thành viên:</span>
                                      <p className="text-gray-900 font-bold">
                                        {nhom.thanhVienNhoms?.length || 0} người
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4 flex-shrink-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewDetail(nhom.id)}
                              className="flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                              Chi tiết
                            </Button>
                            
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteGroup(nhom)}
                              disabled={actionLoading}
                              className="flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Xóa
                            </Button>
                          </div>
                        </div>
                        
                        {/* Danh sách thành viên */}
                        {nhom.thanhVienNhoms && nhom.thanhVienNhoms.length > 0 && (
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <span className="text-lg mr-2">👤</span>
                              Danh sách thành viên ({nhom.thanhVienNhoms.length}):
                            </h4>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-gray-50 rounded-lg">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      STT
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Họ tên
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Mã sinh viên
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Email
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Vai trò
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {nhom.thanhVienNhoms.map((thanhVien, memberIndex) => (
                                    <tr 
                                      key={thanhVien.id} 
                                      className="hover:bg-white transition-colors"
                                    >
                                      <td className="py-3 px-4 text-sm text-gray-500">
                                        {memberIndex + 1}
                                      </td>
                                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                        {thanhVien.hoTen}
                                      </td>
                                      <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                                        {thanhVien.maSinhVien}
                                      </td>
                                      <td className="py-3 px-4 text-sm text-gray-500">
                                        {thanhVien.email || (
                                          <span className="text-gray-400 italic">Chưa có email</span>
                                        )}
                                      </td>
                                      <td className="py-3 px-4 text-sm">
                                        {thanhVien.email === nhom.emailNhomTruong ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            👑 Nhóm trưởng
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            👤 Thành viên
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

export default DanhSachNhomDangKyPage;