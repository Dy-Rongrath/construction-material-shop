'use client';

import { useEffect } from 'react';

/**
 * Performance monitoring component
 * Tracks Core Web Vitals and other performance metrics
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Dynamic import to avoid bundling in development
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      // Core Web Vitals
      onCLS(() => {
        sendToAnalytics();
      });

      onFCP(() => {
        sendToAnalytics();
      });

      onLCP(() => {
        sendToAnalytics();
      });

      onTTFB(() => {
        sendToAnalytics();
      });

      onINP(() => {
        sendToAnalytics();
      });
    });
  }, []);

  // Send metrics to analytics service
  const sendToAnalytics = () => {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
    }
    // In production, you would send to analytics service like Google Analytics
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50 text-xs">
      Performance Monitor Active
    </div>
  );
}

/**
 * Resource hints component for performance optimization
 */
export function ResourceHints() {
  return (
    <>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* DNS prefetch for common domains */}
      <link rel="dns-prefetch" href="//placehold.co" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
    </>
  );
}
