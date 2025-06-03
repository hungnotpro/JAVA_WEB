import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import nhomController from '../controllers/nhomController';
import topicController from '../controllers/topicController';
import { formatDate } from '../utils/formatters';

/**
 * Trang hiển thị danh sách đề tài đã đăng ký của sinh viên
 */
const StudentMyTopicsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [nhoms, setNhoms] = useState([]);
  const [topics, setTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    // Fetch danh sách nhóm và đề tài khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch danh sách nhóm
        const nhomData = await nhomController.getMyGroups();
        setNhoms(nhomData);
        
        // Fetch thông tin đề tài cho mỗi nhóm nếu cần
        const topicDetails = {};
        for (const nhom of nhomData) {
          if (nhom.tenDeTai) {
            // Nếu API đã trả về thông tin đề tài trong nhóm
            topicDetails[nhom.id] = {
              tenDeTai: nhom.tenDeTai,
              moTa: nhom.moTa || 'Không có mô tả'
            };
          } else if (nhom.deTaiId) {
            // Nếu cần fetch thêm thông tin đề tài
            try {
              const topic = await topicController.getTopicById(nhom.deTaiId);
              topicDetails[nhom.deTaiId] = topic;
            } catch (err) {
              console.error(`Error fetching topic detail for ID ${nhom.deTaiId}:`, err);
            }
          }
        }
        setTopics(topicDetails);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Không thể tải danh sách đề tài đã đăng ký');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-center">
              <Spinner size="lg" text="Đang tải danh sách đề tài đã đăng ký..." />
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
              <h1 className="text-2xl font-bold text-gray-900">Đề tài đã đăng ký</h1>
              <Button 
                onClick={() => navigate('/student/topics')} 
                variant="primary"
              >
                Xem danh sách đề tài
              </Button>
            </div>
            
            {error && (
              <Alert type="error" message={error} className="mb-4" />
            )}
            
            {!loading && nhoms.length === 0 ? (
              <Card>
                <div className="py-8 text-center">
                  <p className="text-gray-500 mb-4">Bạn chưa đăng ký đề tài nào</p>
                  <Button
                    onClick={() => navigate('/student/topics')}
                    variant="primary"
                  >
                    Xem danh sách đề tài
                  </Button>
                </div>
              </Card>
            ) : (              <div className="space-y-6">
                {nhoms.map((nhom) => (
                  <Card key={nhom.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {nhom.tenDeTai || topics[nhom.deTaiId]?.tenDeTai || 'Đề tài không có sẵn'}
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                          Đã đăng ký
                        </span>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="font-medium">Nhóm trưởng:</p>
                            <p>{nhom.thanhVienNhoms?.find(tv => tv.email === nhom.emailNhomTruong)?.hoTen || nhom.emailNhomTruong}</p>
                          </div>
                          <div>
                            <p className="font-medium">Email:</p>
                            <p>{nhom.emailNhomTruong}</p>
                          </div>
                          <div>
                            <p className="font-medium">Số thành viên:</p>
                            <p>{nhom.thanhVienNhoms?.length || 'Chưa có thông tin'}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="font-medium">Mô tả đề tài:</p>
                          <p className="mt-1">{topics[nhom.id]?.moTa || nhom.moTa || 'Không có mô tả'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/student/my-topics/${nhom.id}`)}
                        >
                          Quản lý thành viên
                        </Button>
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
  );
};

export default StudentMyTopicsPage;
