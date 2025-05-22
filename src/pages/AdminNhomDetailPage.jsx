import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import nhomController from '../controllers/nhomController';
import thanhVienController from '../controllers/thanhVienController';
import topicController from '../controllers/topicController';
import ThanhVienNhomModel from '../models/ThanhVienNhomModel';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Component hiển thị chi tiết nhóm và quản lý thành viên
 */
const AdminNhomDetailPage = () => {
  const { nhomId } = useParams();
  const navigate = useNavigate();
  
  // State quản lý thông tin nhóm và thành viên
  const [nhom, setNhom] = useState(null);
  const [deTai, setDeTai] = useState(null);
  const [thanhViens, setThanhViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // State quản lý form thêm/sửa thành viên
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
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
  
  // Hàm fetch dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch thông tin nhóm
      const nhomData = await nhomController.getNhomById(nhomId);
      setNhom(nhomData);
      
      // Fetch thông tin đề tài
      if (nhomData.deTaiId) {
        const deTaiData = await topicController.getTopicById(nhomData.deTaiId);
        setDeTai(deTaiData);
      }
      
      // Fetch danh sách thành viên
      const thanhVienData = await thanhVienController.getThanhVienByNhom(nhomId);
      setThanhViens(thanhVienData);
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
  
  // Mở form thêm thành viên mới
  const handleAddMember = () => {
    setFormData({
      id: null,
      hoTen: '',
      maSinhVien: '',
      email: ''
    });
    setIsEditing(false);
    setIsFormOpen(true);
  };
  
  // Mở form sửa thành viên
  const handleEditMember = (thanhVien) => {
    setFormData({
      id: thanhVien.id,
      hoTen: thanhVien.hoTen,
      maSinhVien: thanhVien.maSinhVien,
      email: thanhVien.email || ''
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };
  
  // Xử lý xóa thành viên
  const handleDeleteMember = async (thanhVienId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await thanhVienController.deleteThanhVien(thanhVienId);
      
      // Cập nhật danh sách sau khi xóa
      setThanhViens(thanhViens.filter(tv => tv.id !== thanhVienId));
      
      setActionSuccess('Xóa thành viên thành công!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      setError('Không thể xóa thành viên: ' + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Xử lý khi thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Xử lý khi submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      if (isEditing) {
        // Cập nhật thành viên
        const updatedMember = await thanhVienController.updateThanhVien(
          formData.id,
          formData
        );
        
        // Cập nhật state
        setThanhViens(thanhViens.map(tv => 
          tv.id === updatedMember.id ? updatedMember : tv
        ));
        
        setActionSuccess('Cập nhật thành viên thành công!');
      } else {
        // Thêm thành viên mới
        const newMember = await thanhVienController.addThanhVien(
          nhomId,
          formData
        );
        
        // Cập nhật state
        setThanhViens([...thanhViens, newMember]);
        
        setActionSuccess('Thêm thành viên mới thành công!');
      }
      
      // Đóng form và reset
      setIsFormOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      setError(`Không thể ${isEditing ? 'cập nhật' : 'thêm'} thành viên: ` + (error.message || ''));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Kiểm tra trùng mã sinh viên
  const isDuplicateMaSV = (maSV) => {
    if (isEditing) {
      return thanhViens.some(tv => tv.id !== formData.id && tv.maSinhVien === maSV);
    }
    return thanhViens.some(tv => tv.maSinhVien === maSV);
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
              onClick={() => navigate('/admin/nhom')}
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
                  {/* Thông tin nhóm */}
                  <Card title="Thông tin nhóm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Tên đề tài</h4>
                        <p className="mt-1">{nhom.tenDeTai || (deTai ? deTai.tenDeTai : 'Không xác định')}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email nhóm trưởng</h4>
                        <p className="mt-1">{nhom.emailNhomTruong}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Thời gian tạo</h4>
                        <p className="mt-1">{formatDate(nhom.thoiGianTao)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Số thành viên</h4>
                        <p className="mt-1">{thanhViens.length}</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Danh sách thành viên */}
                  <Card 
                    title={
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Danh sách thành viên</h3>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddMember}
                        >
                          Thêm thành viên
                        </Button>
                      </div>
                    }
                  >
                    {/* Form thêm/sửa thành viên */}
                    {isFormOpen && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-md">
                        <h4 className="text-base font-medium text-gray-700 mb-3">
                          {isEditing ? 'Cập nhật thông tin thành viên' : 'Thêm thành viên mới'}
                        </h4>
                        <form onSubmit={handleFormSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ tên <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="hoTen"
                                value={formData.hoTen}
                                onChange={handleFormChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã sinh viên <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="maSinhVien"
                                value={formData.maSinhVien}
                                onChange={handleFormChange}
                                required
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                  isDuplicateMaSV(formData.maSinhVien) ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {isDuplicateMaSV(formData.maSinhVien) && (
                                <p className="mt-1 text-sm text-red-500">
                                  Mã sinh viên đã tồn tại trong nhóm
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setIsFormOpen(false)}
                            >
                              Hủy
                            </Button>
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={isDuplicateMaSV(formData.maSinhVien)}
                            >
                              {isEditing ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {thanhViens.length === 0 ? (
                      <p className="text-gray-500">Chưa có thành viên nào trong nhóm</p>
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
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {thanhViens.map((thanhVien, index) => (
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditMember(thanhVien)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(thanhVien.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Xóa
                                  </button>
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

export default AdminNhomDetailPage;