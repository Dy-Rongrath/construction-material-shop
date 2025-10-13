'use client';

import React, { useState } from 'react';

// Type definitions
interface IconProps {
  path: string;
  className?: string;
}

interface InfoCardProps {
  title: string;
  iconPath: string;
  children: React.ReactNode;
}

// Reusable Icon component
const Icon: React.FC<IconProps> = ({ path, className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Mock data - replace with data from your backend
const mockUser = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  memberSince: '2023-01-15',
};

const mockOrders = [
  { id: 'ORD-101', date: '2024-07-21', total: 145.5, status: 'Delivered', items: 3 },
  { id: 'ORD-102', date: '2024-07-18', total: 89.99, status: 'Delivered', items: 1 },
  { id: 'ORD-103', date: '2024-06-30', total: 320.0, status: 'Cancelled', items: 5 },
  { id: 'ORD-104', date: '2024-08-01', total: 45.0, status: 'Shipped', items: 2 },
];

const mockAddresses = [
  {
    id: 1,
    type: 'Shipping',
    line1: '123 Industrial Way',
    city: 'Metropolis',
    country: 'USA',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Billing',
    line1: '456 Business Blvd',
    city: 'Metropolis',
    country: 'USA',
    isDefault: false,
  },
];

// Reusable Card component for sections
const InfoCard: React.FC<InfoCardProps> = ({ title, iconPath, children }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <Icon path={iconPath} className="w-6 h-6 text-yellow-400 mr-3" />
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

// Main Account Page Component
export default function AccountPage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('name') as string;
    if (newName && newName !== user.name) {
      setUser({ ...user, name: newName });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white">My Account</h1>
          <p className="text-gray-400 mt-2">Manage your profile, orders, and addresses.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Profile and Orders */}
          <div className="lg:col-span-2 space-y-8">
            <InfoCard
              title="Profile Information"
              iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            >
              {isEditing ? (
                <form className="space-y-4" onSubmit={handleProfileUpdate}>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={user.name}
                      className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-sm font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <p>
                    <strong className="font-medium text-gray-300">Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong className="font-medium text-gray-300">Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong className="font-medium text-gray-300">Member Since:</strong>{' '}
                    {user.memberSince}
                  </p>
                  <div className="text-right">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="font-medium text-yellow-400 hover:text-yellow-300 text-sm"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </InfoCard>

            <InfoCard
              title="Order History"
              iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {mockOrders.map(order => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {order.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-green-900 text-green-300'
                                : order.status === 'Shipped'
                                  ? 'bg-blue-900 text-blue-300'
                                  : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-yellow-400 hover:text-yellow-300">
                            Details
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          </div>

          {/* Sidebar - Addresses */}
          <div className="lg:col-span-1">
            <InfoCard
              title="Manage Addresses"
              iconPath="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            >
              <div className="space-y-4">
                {mockAddresses.map(addr => (
                  <div key={addr.id} className="bg-gray-700 p-4 rounded-lg relative">
                    {addr.isDefault && (
                      <span className="absolute top-2 right-2 text-xs bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    <p className="font-bold">{addr.type} Address</p>
                    <p className="text-sm text-gray-300">{addr.line1}</p>
                    <p className="text-sm text-gray-300">
                      {addr.city}, {addr.country}
                    </p>
                    <div className="mt-3 flex gap-4 text-xs">
                      <button className="font-medium text-yellow-400 hover:text-yellow-300">
                        Edit
                      </button>
                      <button className="font-medium text-red-500 hover:text-red-400">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 py-2 px-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700 hover:border-gray-500 transition">
                  + Add New Address
                </button>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
