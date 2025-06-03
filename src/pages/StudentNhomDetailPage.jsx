import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import nhomController from '../controllers/nhomController';
import thanhVienController from '../controllers/thanhVienController';
import { useAuth } from '../contexts/AuthContext';
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

  // State cho thêm/sửa thành viên inline
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    hoTen: '',
    maSinhVien: '',
    email: ''
  });

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    if (nhomId) {
      fetchData();
    }
  }, [nhomId]);

  // Hàm fetch dữ liệu nhóm
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const nhomData = await nhomController.getNhomById(nhomId);
      setNhom(nhomData);
    } catch (error) {
      setError('Không thể tải thông tin nhóm: ' + (error.message || ''));
      console.error('Error fetching group data:', error);
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

  // Kiểm tra người dùng hiện tại có phải là nhóm trưởng không
  const isGroupLeader = () => {
    return currentUser && currentUser.email === nhom?.emailNhomTruong;
  };

  // Hủy đăng ký nhóm
  const handleCancelRegistration = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký nhóm này? Hành động này không thể hoàn tác.')) {
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

  // Xử lý thay đổi form thành viên
  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Bắt đầu thêm thành viên mới
  const handleAddMember = () => {
    if (isAddingMember || editingMemberId) {
      return; // Không cho phép thêm khi đang edit hoặc add
    }
    
    setIsAddingMember(true);
    setEditingMemberId(null);
    setMemberForm({
      hoTen: '',
      maSinhVien: '',
      email: ''
    });
  };

  // Bắt đầu sửa thành viên
  const handleEditMember = (member) => {
    if (isAddingMember || editingMemberId) {
      return; // Không cho phép edit khi đang add hoặc edit khác
    }
    
    setEditingMemberId(member.id);
    setIsAddingMember(false);
    setMemberForm({
      hoTen: member.hoTen || '',
      maSinhVien: member.maSinhVien || '',
      email: member.email || ''
    });
  };

  // Hủy thêm/sửa
  const handleCancelEdit = () => {
    setIsAddingMember(false);
    setEditingMemberId(null);
    setMemberForm({
      hoTen: '',
      maSinhVien: '',
      email: ''
    });
  };

  // Lưu thông tin thành viên (thêm mới hoặc cập nhật)
  const handleSaveMember = async () => {
    try {
      setActionLoading(true);
      setError(null);

      // Validate form
      if (!memberForm.hoTen.trim()) {
        setError('Vui lòng nhập họ tên thành viên');
        return;
      }      if (isAddingMember) {
        if (!memberForm.maSinhVien.trim()) {
          setError('Vui lòng nhập mã sinh viên');
          return;
        }
      } else if (editingMemberId) {
        // Chế độ sửa - validate cả họ tên và mã sinh viên
        if (!memberForm.maSinhVien.trim()) {
          setError('Vui lòng nhập mã sinh viên');
          return;
        }
      }      const memberData = {
        hoTen: memberForm.hoTen.trim(),
        maSinhVien: memberForm.maSinhVien.trim(),
        email: memberForm.email.trim() || null,
        nhomId: parseInt(nhomId)
      };

      if (editingMemberId) {
        // Cập nhật thành viên (cho phép sửa cả họ tên và mã sinh viên)
        await thanhVienController.updateThanhVien(editingMemberId, memberData);
        setActionSuccess('Cập nhật thông tin thành viên thành công!');
      } else {
        // Thêm thành viên mới
        await thanhVienController.addThanhVien(memberData);
        setActionSuccess('Thêm thành viên thành công!');
      }

      handleCancelEdit();
      await fetchData(); // Reload data

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Không thể lưu thông tin thành viên: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };

  // Xóa thành viên
  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.hoTen}" khỏi nhóm?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await thanhVienController.deleteThanhVien(member.id);
      
      setActionSuccess(`Đã xóa thành viên "${member.hoTen}" khỏi nhóm!`);
      await fetchData(); // Reload data

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Không thể xóa thành viên: ' + (error.message || ''));
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
            <Spinner size="lg" text="Đang tải thông tin nhóm..." />
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (!nhom && error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert type="error" message={error} />
            <div className="mt-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/student/my-topics')}
              >
                Quay lại danh sách nhóm
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
      
      {actionLoading && <LoadingOverlay text="Đang xử lý..." />}
      
      <div className="py-10">
        {/* Header */}
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Chi tiết nhóm
              </h1>
              {nhom && (
                <p className="mt-1 text-sm text-gray-500">
                  ID: {nhom.id} • Đề tài: {nhom.tenDeTai}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/student/my-topics')}
            >
              ← Quay lại
            </Button>
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

              <div className="space-y-6">
                {/* Thông tin đề tài */}
                <Card title="Thông tin đề tài">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {nhom.tenDeTai}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email nhóm trưởng</h4>
                        <p className="mt-1 text-sm text-gray-900">{nhom.emailNhomTruong}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Thời gian đăng ký</h4>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(nhom.thoiGianTao)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Trạng thái</h4>
                        <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Đã đăng ký
                        </span>
                      </div>
                    </div>
                    
                    {isGroupLeader() && (
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                        <Button
                          variant="danger"
                          onClick={handleCancelRegistration}
                          disabled={actionLoading}
                        >
                          Hủy đăng ký nhóm
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Danh sách thành viên */}
                <Card title="Danh sách thành viên">
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Tổng số thành viên: <span className="font-medium">{nhom.thanhVienNhoms?.length || 0}</span>
                      </p>
                      {(isAddingMember || editingMemberId) && (
                        <p className="text-xs text-blue-600 mt-1">
                          {isAddingMember ? 'Đang thêm thành viên mới...' : 'Đang chỉnh sửa thông tin thành viên...'}
                        </p>
                      )}
                    </div>
                    
                    {isGroupLeader() && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddMember}
                        disabled={isAddingMember || editingMemberId || actionLoading}
                      >
                        + Thêm thành viên
                      </Button>
                    )}
                  </div>
                  
                  {!nhom.thanhVienNhoms || nhom.thanhVienNhoms.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Chưa có thành viên nào trong nhóm</p>
                      {isGroupLeader() && (
                        <p className="text-sm text-gray-400 mt-2">
                          Nhấn "Thêm thành viên" để bắt đầu thêm thành viên
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              STT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Họ tên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mã sinh viên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vai trò
                            </th>
                            {isGroupLeader() && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                              </th>
                            )}
                          </tr>
                        </thead>
                        
                        <tbody className="bg-white divide-y divide-gray-200">
                          {nhom.thanhVienNhoms.map((thanhVien, index) => (
                            <tr 
                              key={thanhVien.id}
                              className={editingMemberId === thanhVien.id ? 'bg-blue-50' : ''}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              
                              {/* Họ tên */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {editingMemberId === thanhVien.id ? (
                                  <Input
                                    name="hoTen"
                                    value={memberForm.hoTen}
                                    onChange={handleMemberFormChange}
                                    placeholder="Nhập họ tên"
                                    className="w-full"
                                    autoFocus
                                  />
                                ) : (
                                  thanhVien.hoTen
                                )}
                              </td>
                                {/* Mã sinh viên */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editingMemberId === thanhVien.id ? (
                                  <Input
                                    name="maSinhVien"
                                    value={memberForm.maSinhVien}
                                    onChange={handleMemberFormChange}
                                    placeholder="Nhập mã sinh viên"
                                    className="w-full"
                                  />
                                ) : (
                                  thanhVien.maSinhVien || '-'
                                )}
                              </td>
                              
                              {/* Email */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {thanhVien.email || '-'}
                              </td>
                              
                              {/* Vai trò */}
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
                              
                              {/* Thao tác */}
                              {isGroupLeader() && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {thanhVien.email !== nhom.emailNhomTruong && (
                                    <div className="flex space-x-2">
                                      {editingMemberId === thanhVien.id ? (
                                        <>
                                          <button
                                            onClick={handleSaveMember}
                                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                                            disabled={actionLoading}
                                          >
                                            Lưu
                                          </button>
                                          <button
                                            onClick={handleCancelEdit}
                                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                            disabled={actionLoading}
                                          >
                                            Hủy
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => handleEditMember(thanhVien)}
                                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                            disabled={isAddingMember || editingMemberId || actionLoading}
                                          >
                                            Sửa
                                          </button>
                                          <button
                                            onClick={() => handleDeleteMember(thanhVien)}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                            disabled={isAddingMember || editingMemberId || actionLoading}
                                          >
                                            Xóa
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                          
                          {/* Dòng thêm thành viên mới */}
                          {isAddingMember && (
                            <tr className="bg-blue-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {nhom.thanhVienNhoms.length + 1}
                              </td>
                              
                              {/* Họ tên */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Input
                                  name="hoTen"
                                  value={memberForm.hoTen}
                                  onChange={handleMemberFormChange}
                                  placeholder="Nhập họ tên *"
                                  className="w-full"
                                  required
                                  autoFocus
                                />
                              </td>
                              
                              {/* Mã sinh viên */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Input
                                  name="maSinhVien"
                                  value={memberForm.maSinhVien}
                                  onChange={handleMemberFormChange}
                                  placeholder="Nhập mã sinh viên *"
                                  className="w-full"
                                  required
                                />
                              </td>
                              
                              {/* Email */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Input
                                  name="email"
                                  type="email"
                                  value={memberForm.email}
                                  onChange={handleMemberFormChange}
                                  placeholder="Nhập email (tùy chọn)"
                                  className="w-full"
                                />
                              </td>
                              
                              {/* Vai trò */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Thành viên
                                </span>
                              </td>
                              
                              {/* Thao tác */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleSaveMember}
                                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                                    disabled={actionLoading}
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                    disabled={actionLoading}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                    {/* Chú thích */}
                  {isGroupLeader() && (
                    <div className="mt-4 text-xs text-gray-500 border-t pt-3">
                      <p>
                        <strong>Lưu ý:</strong> Chỉ nhóm trưởng mới có thể thêm, sửa, xóa thành viên. 
                        Có thể sửa cả họ tên và mã sinh viên.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentNhomDetailPage;