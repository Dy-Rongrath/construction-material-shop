'use client';
import React from 'react';

// Reusable Icon component
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

// Reusable Input component for Auth forms
const AuthInput = ({
  label,
  id,
  type = 'text',
  placeholder,
  iconPath,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  iconPath: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon path={iconPath} className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
      />
    </div>
  </div>
);

// Main Register Page Component
export default function RegisterPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-yellow-400">BuildMart</h2>
          <p className="mt-2 text-center text-sm text-gray-400">Create your new account</p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-y-6">
            <AuthInput
              label="Full Name"
              id="full-name"
              type="text"
              placeholder="John Doe"
              iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
            <AuthInput
              label="Email address"
              id="email-address"
              type="email"
              placeholder="you@example.com"
              iconPath="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
            <AuthInput
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
            <AuthInput
              label="Confirm Password"
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-yellow-400 hover:text-yellow-300">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
