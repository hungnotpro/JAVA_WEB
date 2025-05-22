import React from 'react';

/**
 * Button component với nhiều biến thể
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Biến thể của button: 'primary', 'secondary', 'danger', 'success'
 * @param {boolean} [props.fullWidth=false] - Button chiếm toàn bộ chiều rộng
 * @param {boolean} [props.disabled=false] - Trạng thái disabled
 * @param {Function} [props.onClick] - Hàm xử lý khi click
 * @param {ReactNode} props.children - Nội dung bên trong button
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  ...rest
}) => {
  // Xác định style dựa trên variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 text-gray-800';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white';
      case 'outline':
        return 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-indigo-500';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white';
    }
  };

  const baseClasses = 'py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium shadow-sm transition-colors';
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseClasses} ${getVariantClasses()} ${widthClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;