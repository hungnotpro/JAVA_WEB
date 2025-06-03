import React from 'react';

/**
 * Component Button tùy chỉnh
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) => {
  // Xác định classes dựa trên variant
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
  };
  
  // Xác định classes dựa trên kích thước
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base'
  };
  
  // Các classes khi button bị disabled
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-md shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${(disabled || loading) ? disabledClasses : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
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
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;