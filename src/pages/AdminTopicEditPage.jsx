import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import topicController from '../controllers/topicController';

/**
 * Trang chỉnh sửa đề tài (dành cho admin)
 */
const AdminTopicEditPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    tenDeTai: '',
    moTa: '',
    soNhomToiDa: 1,
    soThanhVienToiThieu: 1,
    soThanhVienToiDa: 1
  });
  
  // Lấy thông tin chi tiết đề tài khi component mount
  useEffect(() => {
    const fetchTopicDetail = async () => {
      try {
        setLoading(true);
        const data = await topicController.getTopicById(topicId);
        setFormData({
          tenDeTai: data.tenDeTai || '',
          moTa: data.moTa || '',
          soNhomToiDa: data.soNhomToiDa || 1,
          soThanhVienToiThieu: data.soThanhVienToiThieu || 1,
          soThanhVienToiDa: data.soThanhVienToiDa || 1
        });
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'soNhomToiDa' || name === 'soThanhVienToiThieu' || name === 'soThanhVienToiDa' 
        ? parseInt(value, 10) 
        : value
    });
  };
  
  const validateForm = () => {
    if (!formData.tenDeTai.trim()) {
      setError('Vui lòng nhập tên đề tài');
      return false;
    }
    
    if (!formData.moTa.trim()) {
      setError('Vui lòng nhập mô tả đề tài');
      return false;
    }
    
    if (formData.soNhomToiDa < 1) {
      setError('Số nhóm tối đa phải lớn hơn 0');
      return false;
    }
    
    if (formData.soThanhVienToiThieu < 1) {
      setError('Số thành viên tối thiểu phải lớn hơn 0');
      return false;
    }
    
    if (formData.soThanhVienToiDa < formData.soThanhVienToiThieu) {
      setError('Số thành viên tối đa phải lớn hơn hoặc bằng số thành viên tối thiểu');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      await topicController.updateTopic(topicId, formData);
      
      setSuccess('Cập nhật đề tài thành công!');
      
      // Chuyển về trang chi tiết sau 2 giây
      setTimeout(() => {
        navigate(`/admin/topics/${topicId}`);
      }, 2000);
    } catch (err) {
      console.error('Error updating topic:', err);
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật đề tài');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/admin/topics/${topicId}`);
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
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Chỉnh sửa đề tài
              </h1>
              <Button variant="secondary" onClick={handleCancel}>
                Quay lại
              </Button>
            </div>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {success && (
                <Alert type="success" message={success} className="mb-4" />
              )}
              
              {error && (
                <Alert type="error" message={error} className="mb-4" />
              )}
              
              <Card>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <Input
                      label="Tên đề tài"
                      name="tenDeTai"
                      value={formData.tenDeTai}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <div>
                      <label htmlFor="moTa" className="block text-sm font-medium text-gray-700">
                        Mô tả đề tài <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="moTa"
                        name="moTa"
                        rows={4}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={formData.moTa}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Số nhóm tối đa"
                        name="soNhomToiDa"
                        type="number"
                        min={1}
                        value={formData.soNhomToiDa}
                        onChange={handleInputChange}
                        required
                      />
                      
                      <Input
                        label="Số thành viên tối thiểu"
                        name="soThanhVienToiThieu"
                        type="number"
                        min={1}
                        value={formData.soThanhVienToiThieu}
                        onChange={handleInputChange}
                        required
                      />
                      
                      <Input
                        label="Số thành viên tối đa"
                        name="soThanhVienToiDa"
                        type="number"
                        min={1}
                        value={formData.soThanhVienToiDa}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submitting}
                      disabled={submitting}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTopicEditPage;