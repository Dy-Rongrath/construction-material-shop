'use client';

import { Loader2 } from 'lucide-react';

/**
 * A small, reusable spinner component.
 * Ideal for indicating loading state within other components, like buttons.
 * @param {{size: number, className: string}} props - Size and additional classes for styling.
 */
export default function Spinner({ size = 24, className = 'text-yellow-500' }) {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
}
