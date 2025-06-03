import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import Card from '../components/Card';
import { formatDate } from '../utils/formatters';

/**
 * Component hiển thị danh sách đề tài với các thông tin chỉ định
 */
const TopicListPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/topic');
        if (response.data && response.data.code === 1000) {
          setTopics(response.data.result);
        } else {
          setError('Không thể tải danh sách đề tài');
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Đã xảy ra lỗi khi tải danh sách đề tài');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Danh sách đề tài</h1>
        
        {topics.length === 0 ? (
          <p className="text-gray-500">Không có đề tài nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map(topic => (
              <Card key={topic.id} className="h-full">
                <div className="p-4 flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{topic.tenDeTai}</h2>
                  
                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-500 mb-1">Mô tả:</p>
                    <p className="text-sm text-gray-700">{topic.moTa}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Số nhóm:</p>
                      <p className="text-sm font-medium">{topic.soNhomDaDangKy} / {topic.soNhomToiDa}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Số thành viên:</p>
                      <p className="text-sm font-medium">{topic.soThanhVienToiThieu} - {topic.soThanhVienToiDa}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-auto">
                    <p className="text-xs text-gray-500">Thời gian tạo:</p>
                    <p className="text-sm">{formatDate(topic.thoiGianTao)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicListPage;