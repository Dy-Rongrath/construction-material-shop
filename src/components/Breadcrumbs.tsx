'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * A reusable breadcrumb navigation component.
 * @param props - The component props.
 * @param props.items - An array of breadcrumb items. The last item is the current page.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {/* Add a separator before each item except the first one */}
            {index > 0 && <ChevronRight size={16} className="mx-1 text-gray-500" />}

            {/* If it's not the last item, it's a clickable link */}
            {index < items.length - 1 ? (
              <a href={item.href} className="text-gray-400 hover:text-yellow-400 transition-colors">
                {item.name}
              </a>
            ) : (
              // The last item is the current page, so it's not a link
              <span className="text-white font-semibold" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
