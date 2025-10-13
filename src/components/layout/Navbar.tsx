'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Helper component for Icons
const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

// Navbar Component
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Cement & Concrete', href: '/products/cement' },
    { name: 'Steel & Rebar', href: '/products/steel' },
    { name: 'Bricks & Masonry', href: '/products/masonry' },
    { name: 'Lumber & Wood', href: '/products/wood' },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-extrabold text-yellow-400">
              BuildMart
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search and Icons Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden sm:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search materials..."
                  className="bg-gray-700 border border-gray-600 rounded-lg w-40 lg:w-64 pl-10 pr-4 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500 transition"
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <Link
                href="/account"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </Link>
              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors relative"
              >
                <Icon path="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-yellow-500 text-gray-900 text-xs font-bold flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                  3
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <Icon path="M6 18L18 6M6 6l12 12" className="block h-6 w-6" />
                ) : (
                  <Icon path="M4 6h16M4 12h16M4 18h16" className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="sm:hidden p-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search materials..."
                  className="bg-gray-700 border border-gray-600 rounded-lg w-full pl-10 pr-4 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500 transition"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
