
import React from 'react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent`}
      role="status"
      aria-label="loading"
    ></div>
  );
};
