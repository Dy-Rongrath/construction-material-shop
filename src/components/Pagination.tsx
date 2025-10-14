'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageRangeDisplayed?: number;
}

/**
 * A reusable pagination component.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageRangeDisplayed = 5,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= pageRangeDisplayed) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfRange = Math.floor(pageRangeDisplayed / 2);
      if (currentPage <= halfRange) {
        startPage = 1;
        endPage = pageRangeDisplayed;
      } else if (currentPage + halfRange >= totalPages) {
        startPage = totalPages - pageRangeDisplayed + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfRange;
        endPage = currentPage + halfRange;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-yellow-500 text-gray-900'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <span key="start-ellipsis" className="px-4 py-2 text-gray-400">
          ...
        </span>,
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600"
        >
          1
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <span key="end-ellipsis" className="px-4 py-2 text-gray-400">
          ...
        </span>,
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <nav className="flex items-center justify-center space-x-2 mt-12" aria-label="Pagination">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="hidden md:flex items-center space-x-2">{renderPageNumbers()}</div>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
