import React from 'react';

/**
 * Component hiển thị spinner khi đang tải dữ liệu
 * @param {Object} props
 * @param {string} props.size - Kích thước: 'sm', 'md', 'lg'
 * @param {string} props.color - Màu: 'primary', 'secondary', 'white'
 * @param {string} props.text - Văn bản hiển thị bên dưới spinner
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  text
}) => {
  // Xác định kích thước
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Xác định màu sắc
  const colorClasses = {
    primary: 'text-indigo-500',
    secondary: 'text-gray-500',
    white: 'text-white'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

/**
 * Component hiển thị lớp phủ loading che cả trang
 * @param {Object} props
 * @param {string} props.text - Văn bản hiển thị
 * @param {boolean} props.transparent - Nền trong suốt hay không
 */
export const LoadingOverlay = ({ text, transparent = false }) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${transparent ? 'bg-opacity-50' : 'bg-opacity-75'} bg-gray-900`}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full flex flex-col items-center">
        <Spinner size="lg" color="primary" />
        {text && <p className="mt-4 text-center text-gray-700">{text}</p>}
      </div>
    </div>
  );
};

export default Spinner;