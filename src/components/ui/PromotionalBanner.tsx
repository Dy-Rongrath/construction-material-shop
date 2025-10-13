import React from 'react';
import Button from '@/components/ui/button';

interface PromotionalBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  description,
  ctaText,
  ctaLink,
  backgroundImage = '/images/hero-banner-bg.jpg',
  alignment = 'left',
  className = '',
}) => {
  const textAlignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-cover bg-center py-16 sm:py-24 lg:py-32 ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      role="banner"
      aria-label={title}
    >
      {/* Overlay to darken image for text readability */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>

      <div
        className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col ${textAlignmentClasses[alignment]}`}
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          {title}
        </h2>
        <p className="max-w-xl text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
          {description}
        </p>
        <a href={ctaLink}>
          <Button size="lg" variant="primary">
            {ctaText}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PromotionalBanner;
