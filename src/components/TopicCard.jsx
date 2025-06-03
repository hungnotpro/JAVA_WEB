import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import TopicRegistrationInfo from './TopicRegistrationInfo';
import { formatDate } from '../utils/formatters';

/**
 * Component hiển thị thông tin cơ bản của đề tài dưới dạng card
 */
const TopicCard = ({ 
  topic, 
  actionText = 'Xem chi tiết', 
  actionLink, 
  onAction,
  showRegistrationInfo = true,
  className = '' 
}) => {
  if (!topic) return null;
  
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex-1">
            {topic.tenDeTai || topic.title}
          </h3>
          
          {topic.status === 'FULL' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
              Đã đủ nhóm
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {topic.moTa || topic.description}
        </p>
        
        {showRegistrationInfo && (
          <div className="mt-4 mb-4">
            <TopicRegistrationInfo topic={topic} />
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-4">
          <p>Thời gian tạo: {formatDate(topic.thoiGianTao || topic.createdAt)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        {actionLink ? (
          <Link to={actionLink}>
            <Button 
              variant="primary" 
              fullWidth 
              disabled={topic.status === 'FULL' && actionText === 'Đăng ký'}
            >
              {actionText}
            </Button>
          </Link>
        ) : (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={onAction} 
            disabled={topic.status === 'FULL' && actionText === 'Đăng ký'}
          >
            {actionText}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TopicCard;