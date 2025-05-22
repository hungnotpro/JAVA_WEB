import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner, { LoadingOverlay } from '../components/Spinner';
import topicController from '../controllers/topicController';
import nhomController from '../controllers/nhomController';
import ThanhVienNhomModel from '../models/ThanhVienNhomModel';
import NhomModel from '../models/NhomModel';
import useAuth from '../hooks/useAuth';

/**
 * Component form đăng ký nhóm cho một đề tài
 */
const DangKyNhomPage = () => {
  const { deTaiId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State quản lý thông tin đề tài
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // State quản lý form đăng ký
  const [nhomTruong, setNhomTruong] = useState({
    hoTen: '',
    maSinhVien: ''
  });
  
  const [thanhViens, setThanhViens] = useState([
    { hoTen: '', maSinhVien: '' }
  ]);
  
  // Fetch đề tài khi component mount
  useEffect(() => {
    if (deTaiId) {
      fetchTopic();
    }
  }, [deTaiId]);
  
  // Fetch thông tin đề tài
  const fetchTopic = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const topicData = await topicController.getTopicById(deTaiId);
      setTopic(topicData);
      
      // Nếu có thông tin người dùng, điền vào nhóm trưởng
      if (currentUser) {
        setNhomTruong({
          hoTen: currentUser.name || '',
          maSinhVien: currentUser.studentId || ''
        });
      }
    } catch (error) {
      setError('Không thể tải thông tin đề tài: ' + (error.message || ''));
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý khi thay đổi thông tin nhóm trưởng
  const handleNhomTruongChange = (e) => {
    const { name, value } = e.target;
    setNhomTruong(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Xử lý khi thay đổi thông tin thành viên
  const handleThanhVienChange = (index, e) => {
    const { name, value } = e.target;
    const updatedThanhViens = [...thanhViens];
    updatedThanhViens[index] = {
      ...updatedThanhViens[index],
      [name]: value
    };
    setThanhViens(updatedThanhViens);
  };
  
  // Thêm ô nhập thông tin thành viên mới
  const handleAddThanhVien = () => {
    setThanhViens([...thanhViens, { hoTen: '', maSinhVien: '' }]);
  };
  
  // Xóa ô nhập thông tin thành viên
  const handleRemoveThanhVien = (index) => {
    const updatedThanhViens = thanhViens.filter((_, i) => i !== index);
    setThanhViens(updatedThanhViens);
  };
  
  // Kiểm tra mã sinh viên trùng lặp
  const checkDuplicateMaSV = () => {
    const maSVList = [nhomTruong.maSinhVien, ...thanhViens.map(tv => tv.maSinhVien)].filter(Boolean);
    const uniqueMaSV = new Set(maSVList);
    
    return maSVList.length !== uniqueMaSV.size;
  };
  
  // Kiểm tra form hợp lệ trước khi submit
  const isFormValid = () => {
    // Kiểm tra thông tin nhóm trưởng
    if (!nhomTruong.hoTen || !nhomTruong.maSinhVien) {
      return false;
    }
    
    // Kiểm tra tất cả thành viên có đầy đủ thông tin không
    const validThanhViens = thanhViens.filter(tv => tv.hoTen && tv.maSinhVien);
    
    // Kiểm tra xem có ít nhất một thành viên hợp lệ không
    // và số lượng thành viên có thỏa mãn yêu cầu của đề tài không
    const totalMembers = validThanhViens.length + 1; // +1 cho nhóm trưởng
    
    return (
      validThanhViens.length === thanhViens.length &&
      totalMembers >= (topic?.soThanhVienToiThieu || 1) &&
      totalMembers <= (topic?.soThanhVienToiDa || 10) &&
      !checkDuplicateMaSV()
    );
  };
  
  // Xử lý khi submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Vui lòng kiểm tra lại thông tin đăng ký.');
      return;
    }
    
    try {
      setActionLoading(true);
      
      // Tạo dữ liệu đăng ký nhóm
      const nhomData = {
        emailNhomTruong: currentUser?.email || 'student@example.com',
        deTaiId: parseInt(deTaiId, 10),
        thongTinNhomTruong: {
          hoTen: nhomTruong.hoTen,
          maSinhVien: nhomTruong.maSinhVien
        },
        danhSachThanhVien: thanhViens.filter(tv => tv.hoTen && tv.maSinhVien)
      };
      
      // Gọi controller để đăng ký nhóm
      const result = await nhomController.createNhom(nhomData);
      
      // Hiển thị thông báo thành công và chuyển hướng
      setActionSuccess('Đăng ký nhóm thành công!');
      setTimeout(() => {
        navigate('/student/my-topics');
      }, 3000);
    } catch (error) {
      setError('Không thể đăng ký nhóm: ' + (error.message || ''));
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
              Đăng ký nhóm
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
              
              {loading ? (
                <div className="py-12">
                  <Spinner size="lg" text="Đang tải thông tin đề tài..." />
                </div>
              ) : !topic ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  <p className="text-gray-500">Không tìm thấy thông tin đề tài</p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => navigate('/student/topics')}
                  >
                    Quay lại danh sách đề tài
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Thông tin đề tài */}
                  <Card title="Thông tin đề tài">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{topic.tenDeTai}</h3>
                      <p className="text-sm text-gray-600">{topic.moTa}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Số nhóm đã đăng ký</h4>
                        <p className="mt-1">{topic.soNhomDaDangKy} / {topic.soNhomToiDa}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Số thành viên tối thiểu</h4>
                        <p className="mt-1">{topic.soThanhVienToiThieu}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Số thành viên tối đa</h4>
                        <p className="mt-1">{topic.soThanhVienToiDa}</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Form đăng ký nhóm */}
                  <Card title="Đăng ký nhóm">
                    <form onSubmit={handleSubmit}>
                      {/* Thông tin nhóm trưởng */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-4">
                          Thông tin nhóm trưởng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="hoTen"
                              value={nhomTruong.hoTen}
                              onChange={handleNhomTruongChange}
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
                              value={nhomTruong.maSinhVien}
                              onChange={handleNhomTruongChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Danh sách thành viên */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-base font-medium text-gray-900">
                            Danh sách thành viên
                          </h3>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddThanhVien}
                          >
                            Thêm thành viên
                          </Button>
                        </div>
                        
                        {/* Thành viên hiện tại */}
                        {thanhViens.map((thanhVien, index) => (
                          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-medium text-gray-700">
                                Thành viên {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveThanhVien(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Xóa
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Họ tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="hoTen"
                                  value={thanhVien.hoTen}
                                  onChange={(e) => handleThanhVienChange(index, e)}
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
                                  value={thanhVien.maSinhVien}
                                  onChange={(e) => handleThanhVienChange(index, e)}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Thông báo về số lượng thành viên */}
                        <div className="mt-2 mb-6">
                          <p className="text-sm text-gray-500">
                            Tổng số thành viên (bao gồm nhóm trưởng): {thanhViens.length + 1}
                          </p>
                          {checkDuplicateMaSV() && (
                            <p className="text-sm text-red-500 mt-1">
                              Có mã sinh viên bị trùng lặp. Vui lòng kiểm tra lại.
                            </p>
                          )}
                          {thanhViens.length + 1 < (topic?.soThanhVienToiThieu || 1) && (
                            <p className="text-sm text-red-500 mt-1">
                              Số lượng thành viên chưa đủ tối thiểu ({topic?.soThanhVienToiThieu || 1}).
                            </p>
                          )}
                          {thanhViens.length + 1 > (topic?.soThanhVienToiDa || 10) && (
                            <p className="text-sm text-red-500 mt-1">
                              Số lượng thành viên vượt quá tối đa ({topic?.soThanhVienToiDa || 10}).
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Nút submit */}
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => navigate('/student/topics')}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={!isFormValid()}
                        >
                          Đăng ký
                        </Button>
                      </div>
                    </form>
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

export default DangKyNhomPage;