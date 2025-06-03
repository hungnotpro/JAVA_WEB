import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';
import Input from '../components/Input';
import topicController from '../controllers/topicController';
import nhomDangKyController from '../controllers/nhomDangKyController';

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
  const [actionSuccess, setActionSuccess] = useState(null);  // State cho thông tin nhóm trưởng
  const [nhomTruong, setNhomTruong] = useState({
    hoTen: currentUser?.name || '',
    maSinhVien: currentUser?.studentId || '', // Lấy từ currentUser, không cho phép chỉnh sửa
    email: currentUser?.email || ''
  });

  // State cho danh sách thành viên (không bao gồm nhóm trưởng)
  const [thanhViens, setThanhViens] = useState([
    { hoTen: '', maSinhVien: '' },
    { hoTen: '', maSinhVien: '' }
  ]);
    // Load thông tin đề tài khi component mount
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        setLoading(true);
        const data = await topicController.getTopicById(deTaiId);
        setTopic(data);
      } catch (err) {
        console.error('Error fetching topic:', err);
        setError('Không thể tải thông tin đề tài');
      } finally {
        setLoading(false);
      }
    };

    if (deTaiId) {
      fetchTopicData();
    }
      // Debug: log currentUser info
    console.log('Current user info:', currentUser);
    console.log('Student ID:', currentUser?.studentId);
    console.log('Email:', currentUser?.email);
    console.log('Name:', currentUser?.name);
    
    // Cập nhật nhomTruong khi currentUser thay đổi
    if (currentUser) {
      setNhomTruong(prev => ({
        ...prev,
        hoTen: currentUser?.name || prev.hoTen,
        maSinhVien: currentUser?.studentId || prev.maSinhVien,
        email: currentUser?.email || prev.email
      }));
    }
  }, [deTaiId, currentUser]);

  // Cập nhật thông tin nhóm trưởng
  const handleNhomTruongChange = (e) => {
    const { name, value } = e.target;
    setNhomTruong({
      ...nhomTruong,
      [name]: value
    });
  };

  // Cập nhật thông tin thành viên
  const handleThanhVienChange = (index, e) => {
    const { name, value } = e.target;
    const updatedThanhViens = [...thanhViens];
    updatedThanhViens[index] = {
      ...updatedThanhViens[index],
      [name]: value
    };
    setThanhViens(updatedThanhViens);
  };

  // Thêm một dòng thành viên mới
  const handleAddThanhVien = () => {
    setThanhViens([...thanhViens, { hoTen: '', maSinhVien: '' }]);
  };

  // Xóa thành viên khỏi danh sách
  const handleRemoveThanhVien = (index) => {
    if (thanhViens.length <= 1) {
      return; // Giữ ít nhất 1 thành viên
    }
    const updatedThanhViens = [...thanhViens];
    updatedThanhViens.splice(index, 1);
    setThanhViens(updatedThanhViens);
  };  // Kiểm tra form hợp lệ
  const validateForm = () => {    // Kiểm tra thông tin nhóm trưởng
    if (!nhomTruong.hoTen.trim()) {
      setError('Vui lòng nhập họ tên nhóm trưởng');
      return false;
    }

    // Lọc các thành viên có thông tin hợp lệ
    const validThanhViens = thanhViens.filter(
      tv => tv.hoTen.trim() && tv.maSinhVien.trim()
    );

    // Kiểm tra tổng số thành viên (bao gồm nhóm trưởng)
    const totalMembers = validThanhViens.length + 1;
    
    if (topic.soThanhVienToiThieu && totalMembers < topic.soThanhVienToiThieu) {
      setError(`Nhóm phải có ít nhất ${topic.soThanhVienToiThieu} thành viên (bao gồm nhóm trưởng)`);
      return false;
    }
    
    if (topic.soThanhVienToiDa && totalMembers > topic.soThanhVienToiDa) {
      setError(`Nhóm chỉ được phép có tối đa ${topic.soThanhVienToiDa} thành viên (bao gồm nhóm trưởng)`);
      return false;
    }    // Kiểm tra trùng mã sinh viên (chỉ kiểm tra các thành viên)
    const allMaSV = validThanhViens.map(tv => tv.maSinhVien);
    const uniqueMaSV = new Set(allMaSV);
    
    if (uniqueMaSV.size !== allMaSV.length) {
      setError('Có mã sinh viên bị trùng lặp. Mỗi thành viên phải có mã sinh viên khác nhau');
      return false;
    }

    return true;
  };  // Đăng ký nhóm
  const handleDangKyNhom = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setActionSuccess(null);

      // Kiểm tra form hợp lệ
      if (!validateForm()) {
        setActionLoading(false);
        return;
      }

      // Lọc ra các thành viên có thông tin hợp lệ
      const validThanhViens = thanhViens.filter(
        tv => tv.hoTen.trim() && tv.maSinhVien.trim()
      );      // Chuẩn bị dữ liệu cho API theo cấu trúc mong muốn
      const nhomData = {
        emailNhomTruong: nhomTruong.email,
        deTaiId: parseInt(deTaiId, 10),
        thongTinNhomTruong: {
          hoTen: nhomTruong.hoTen.trim(),
          maSinhVien: nhomTruong.maSinhVien || '' // Cho phép rỗng
        },
        danhSachThanhVien: validThanhViens.map(tv => ({
          hoTen: tv.hoTen.trim(),
          maSinhVien: tv.maSinhVien.trim()
        }))
      };

      console.log('Sending registration data:', nhomData);

      // Gọi API đăng ký nhóm thông qua nhomDangKyController
      const result = await nhomDangKyController.dangKyNhom(nhomData);
      
      console.log('Registration result:', result);
      
      setActionSuccess('Đăng ký nhóm thành công!');
      
      // Chuyển hướng sau khi đăng ký thành công
      setTimeout(() => {
        navigate('/student/my-topics');
      }, 2000);
    } catch (err) {
      console.error('Error registering group:', err);
      setError(err.message || 'Đã xảy ra lỗi khi đăng ký nhóm');
    } finally {
      setActionLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !topic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Alert type="error" message={error} />
            <div className="mt-4">
              <Button onClick={() => navigate('/student/topics')} variant="secondary">
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
              <h1 className="text-2xl font-bold text-gray-900">Đăng ký nhóm</h1>
              <Button 
                onClick={() => navigate('/student/topics')} 
                variant="secondary"
              >
                Quay lại
              </Button>
            </div>

            {actionSuccess && (
              <Alert type="success" message={actionSuccess} className="mb-4" />
            )}
            
            {error && (
              <Alert type="error" message={error} className="mb-4" />
            )}

            {topic && (
              <Card className="mb-6" title="Thông tin đề tài">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{topic.tenDeTai}</h3>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Mô tả</p>
                    <p className="mt-1 text-sm text-gray-900">{topic.moTa}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Số thành viên tối thiểu</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{topic.soThanhVienToiThieu}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Số thành viên tối đa</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{topic.soThanhVienToiDa}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}            <Card title="Thông tin nhóm trưởng" className="mb-6">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Họ tên nhóm trưởng"
                  name="hoTen"
                  onChange={handleNhomTruongChange}
                  placeholder="Nhập họ tên nhóm trưởng"
                  required
                />
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {nhomTruong.email}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Mã sinh viên:</span> {nhomTruong.maSinhVien}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Thông tin thành viên nhóm" className="mb-6">
              <p className="text-sm text-gray-500 mb-4">
                Nhập thông tin các thành viên trong nhóm (không bao gồm nhóm trưởng)
              </p>
              
              {thanhViens.map((thanhVien, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Thành viên {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveThanhVien(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={thanhViens.length <= 1}
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Họ tên"
                      name="hoTen"
                      value={thanhVien.hoTen}
                      onChange={(e) => handleThanhVienChange(index, e)}
                      placeholder="Nhập họ tên thành viên"
                    />
                    <Input
                      label="Mã sinh viên"
                      name="maSinhVien"
                      value={thanhVien.maSinhVien}
                      onChange={(e) => handleThanhVienChange(index, e)}
                      placeholder="Nhập mã sinh viên"
                    />
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <Button 
                  onClick={handleAddThanhVien}
                  variant="secondary"
                  type="button"
                >
                  + Thêm thành viên
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Tổng số thành viên: <span className="font-medium">
                  {thanhViens.filter(tv => tv.hoTen && tv.maSinhVien).length + 1}
                </span> (bao gồm nhóm trưởng)
              </div>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => navigate('/student/topics')} 
                variant="secondary"
                disabled={actionLoading}
              >
                Hủy
              </Button>
              
              <Button 
                onClick={handleDangKyNhom}
                variant="primary"
                loading={actionLoading}
                disabled={actionLoading || actionSuccess}
              >
                Đăng ký nhóm
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DangKyNhomPage;