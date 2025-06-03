import React from 'react';

/**
 * Component hiển thị trạng thái loading
 */
const Spinner = ({ size = 'md', text = 'Đang tải...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

/**
 * Component hiển thị overlay loading toàn màn hình
 */
export const LoadingOverlay = ({ text = 'Đang xử lý...' }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <Spinner size="lg" text={text} />
      </div>
    </div>
  );
};

export default Spinner;