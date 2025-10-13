'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({ className = '', type = 'text', ...props }) => {
  const baseStyles =
    'block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6 transition-colors';

  const classes = `${baseStyles} ${className}`;

  return <input type={type} className={classes} {...props} />;
};

export default Input;
