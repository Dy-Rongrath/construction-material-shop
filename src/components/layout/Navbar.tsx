'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Menu, X, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { state } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Close profile menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const navLinks = [
    { name: 'Cement', href: '/products?category=cement' },
    { name: 'Steel', href: '/products?category=steel' },
    { name: 'Lumber', href: '/products?category=lumber' },
    { name: 'Paints', href: '/products?category=paints' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/ShopLogo.png"
                alt="Construction Material Shop"
                width={180}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
                className="bg-gray-700 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-64"
              />
              <button type="submit">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </button>
            </form>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <ShoppingCart size={24} />
              {state.itemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 rounded-full bg-yellow-500 text-gray-900 text-xs items-center justify-center font-bold">
                  {state.itemCount > 99 ? '99+' : state.itemCount}
                </span>
              )}
            </Link>

            {/* --- Conditional rendering for user actions --- */}
            <div className="hidden lg:flex items-center">
              {user ? (
                // --- Logged-In View ---
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    onBlur={() => setTimeout(() => setIsProfileMenuOpen(false), 150)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    aria-label="User menu"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <UserCircle size={28} />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors focus:bg-gray-700 focus:text-yellow-400 focus:outline-none"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} /> My Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors focus:bg-gray-700 focus:text-red-300 focus:outline-none"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // --- Logged-Out View ---
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-700"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-700"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <div className="px-2 space-y-1">
                <Link
                  href="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2 text-base font-medium rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
