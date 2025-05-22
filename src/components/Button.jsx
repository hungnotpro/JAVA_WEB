import React from 'react';

/**
 * Button component đa năng, hỗ trợ nhiều variant và size
 * @param {Object} props - Props của component
 * @param {string} props.variant - Loại button: 'primary', 'secondary', 'danger', 'success'
 * @param {string} props.size - Kích thước: 'sm', 'md', 'lg'
 * @param {boolean} props.fullWidth - Có chiếm full width không
 * @param {boolean} props.disabled - Có bị disabled không
 * @param {Function} props.onClick - Callback khi click
 * @param {React.ReactNode} props.children - Nội dung button
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick, 
  children,
  className = '' 
}) => {
  // Định nghĩa các class cho variant
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    link: 'text-indigo-600 hover:text-indigo-700 bg-transparent hover:bg-transparent underline'
  };
  
  // Định nghĩa các class cho size
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Kết hợp các classes
  const classes = [
    'inline-flex items-center justify-center font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-200 ease-in-out',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;