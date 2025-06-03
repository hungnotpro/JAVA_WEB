import React from 'react';
import { formatNumber } from '../utils/formatters';

/**
 * Component hiển thị thông tin đăng ký của đề tài
 * Bao gồm số nhóm đã đăng ký và số lượng thành viên
 */
const TopicRegistrationInfo = ({ topic }) => {
  if (!topic) return null;
  
  const percentRegistered = topic.soNhomToiDa > 0 
    ? (topic.soNhomDaDangKy / topic.soNhomToiDa) * 100 
    : 0;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h4 className="font-medium text-gray-900 mb-3">Thông tin đăng ký</h4>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Số nhóm đã đăng ký:</span>
            <span className="font-medium">{topic.soNhomDaDangKy}/{topic.soNhomToiDa}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${percentRegistered >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(percentRegistered, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Số thành viên tối thiểu:</span>
            <span className="font-medium">{formatNumber(topic.soThanhVienToiThieu)}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Số thành viên tối đa:</span>
            <span className="font-medium">{formatNumber(topic.soThanhVienToiDa)}</span>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="text-gray-500 block">Trạng thái:</span>
          <span className={`font-medium ${topic.soNhomDaDangKy >= topic.soNhomToiDa ? 'text-red-600' : 'text-green-600'}`}>
            {topic.soNhomDaDangKy >= topic.soNhomToiDa ? 'Đã đủ số nhóm' : 'Còn nhận đăng ký'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopicRegistrationInfo;