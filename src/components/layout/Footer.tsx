import React from 'react';
import Link from 'next/link';

// Footer Component
const Footer = () => {
  // Reusable Icon component for social media
  const SocialIcon = ({ href, path }: { href: string; path: string }) => (
    <a href={href} className="text-gray-400 hover:text-yellow-400 transition-colors">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );

  return (
    <footer className="bg-gray-800 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-2xl font-extrabold text-yellow-400">Construction Material Shop</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for high-quality construction materials. Built to last, delivered
              with care.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white text-sm">
                  Products
                </Link>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-gray-400 hover:text-white text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <a href="/shipping" className="text-gray-400 hover:text-white text-sm">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="text-gray-400 hover:text-white text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm">Get the latest deals and industry news.</p>
            <form>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex-shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Construction Material Shop. All Rights Reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <SocialIcon
              href="#"
              path="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
            />
            <SocialIcon
              href="#"
              path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"
            />
            <SocialIcon
              href="#"
              path="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.215 3.791 4.649-.69.188-1.432.233-2.202.084.616 1.924 2.441 3.238 4.6 3.282-1.803 1.41-4.103 2.125-6.528 1.795 2.08 1.34 4.568 2.12 7.24 2.12 8.71 0 13.479-7.229 13.479-13.479 0-.205-.005-.409-.013-.612.928-.67 1.734-1.503 2.383-2.474z"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
