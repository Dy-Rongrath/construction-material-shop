'use client';

import React from 'react';
import Spinner from '@/components/Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary', // 'primary' or 'secondary'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  loading = false,
  loadingText,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary: 'bg-yellow-500 text-gray-900 hover:bg-yellow-400',
    secondary:
      'bg-transparent text-yellow-400 border border-yellow-500 hover:bg-yellow-500 hover:text-gray-900',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={classes}
      onClick={loading ? undefined : onClick}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} className="mr-2" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
