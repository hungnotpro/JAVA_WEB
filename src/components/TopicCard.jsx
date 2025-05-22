import React from 'react';
import { formatDate } from '../utils/formatters';
import Button from './Button';
import Card from './Card';

/**
 * Component hiển thị thông tin một đề tài
 * @param {Object} props - Props của component
 * @param {Object} props.topic - Đề tài cần hiển thị
 * @param {boolean} props.isDetailed - Có hiển thị thông tin chi tiết không
 * @param {Function} props.onViewDetails - Callback khi click vào nút xem chi tiết
 * @param {Function} props.onRegister - Callback khi click vào nút đăng ký
 * @param {Function} props.onUnregister - Callback khi click vào nút hủy đăng ký
 * @param {Object} props.currentUser - User hiện tại để kiểm tra đã đăng ký chưa
 */
const TopicCard = ({ 
  topic, 
  isDetailed = false,
  onViewDetails,
  onRegister,
  onUnregister,
  currentUser,
  className = ''
}) => {  // Kiểm tra trạng thái đăng ký
  const isRegistered = currentUser && topic.registeredStudents?.some(student => student?.id === currentUser?.id);
  
  // Kiểm tra còn chỗ đăng ký không
  const hasAvailableSlots = (topic.registeredStudents?.length || 0) < (topic.maxStudents || 1);
  
  // Kiểm tra hết hạn chưa
  const isExpired = topic.deadline ? new Date() > new Date(topic.deadline) : false;
  
  // Hiển thị trạng thái đề tài
  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Hết hạn
        </span>
      );
    }
    
    if (!hasAvailableSlots) {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Đã đầy
        </span>
      );
    }
    
    return (
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        Còn chỗ
      </span>
    );
  };
    // Footer cho card
  const cardFooter = (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        {(topic.registeredStudents?.length || 0)}/{topic.maxStudents || 1} sinh viên
      </div>
      <div className="flex space-x-2">
        {!isDetailed && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(topic.id)}
          >
            Chi tiết
          </Button>
        )}
        
        {currentUser && currentUser.isStudent() && (
          isRegistered ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onUnregister(topic.id)}
              disabled={isExpired}
            >
              Hủy đăng ký
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRegister(topic.id)}
              disabled={!hasAvailableSlots || isExpired}
            >
              Đăng ký
            </Button>
          )
        )}
      </div>
    </div>
  );
  
  // Tiêu đề card
  const cardTitle = (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{topic.title}</h3>
      {getStatusBadge()}
    </div>
  );
  
  return (
    <Card
      title={cardTitle}
      footer={cardFooter}
      className={className}
      hoverable={!isDetailed && !onViewDetails}
      onClick={!isDetailed && !onViewDetails ? () => onViewDetails(topic.id) : undefined}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Giảng viên hướng dẫn</p>
          <p className="mt-1 text-base text-gray-900">{topic.lecturer}</p>
        </div>
        
        {(isDetailed || topic.description) && (
          <div>
            <p className="text-sm text-gray-500">Mô tả</p>
            <p className="mt-1 text-sm text-gray-900">
              {isDetailed ? topic.description : topic.description.substring(0, 100) + (topic.description.length > 100 ? '...' : '')}
            </p>
          </div>
        )}
        
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Ngày tạo</p>
            <p className="mt-1 text-sm text-gray-900">{formatDate(topic.createdAt)}</p>
          </div>
          
          {topic.deadline && (
            <div>
              <p className="text-sm text-gray-500">Hạn đăng ký</p>
              <p className="mt-1 text-sm text-gray-900">{formatDate(topic.deadline)}</p>
            </div>
          )}
        </div>
          {isDetailed && topic.registeredStudents && topic.registeredStudents.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Sinh viên đã đăng ký</p>
            <ul className="divide-y divide-gray-200">
              {topic.registeredStudents.map(student => (
                <li key={student.id || 'anonymous'} className="py-2">
                  <div className="flex items-center">
                    {student.avatar && (
                      <img
                        className="h-8 w-8 rounded-full mr-3"
                        src={student.avatar}
                        alt={`Avatar of ${student.name || 'Unknown'}`}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{student.email || ''}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopicCard;