import React from 'react';

/**
 * Card component để hiển thị thông tin trong container có đường viền
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.title - Tiêu đề của card
 * @param {React.ReactNode} props.children - Nội dung card
 * @param {string} props.footer - Footer của card
 */
const Card = ({
  title,
  children,
  footer,
  className = '',
  onClick,
  hoverable = false
}) => {
  const cardClasses = [
    'bg-white shadow rounded-lg overflow-hidden',
    hoverable ? 'transition hover:shadow-lg' : '',
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;