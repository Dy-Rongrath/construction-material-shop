import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  const baseStyles = 'bg-gray-800 rounded-lg shadow-md overflow-hidden ring-1 ring-white/5';

  const classes = `${baseStyles} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardSectionProps> = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-gray-700 ${className}`}>{children}</div>
);

export const CardContent: React.FC<CardSectionProps> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<CardSectionProps> = ({ children, className = '' }) => (
  <div className={`p-4 border-t border-gray-700 bg-gray-800/50 ${className}`}>{children}</div>
);

export default Card;
