import React from 'react';
import Link from 'next/link';

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

export default function OrderConfirmationPage() {
  // In a real app, you would fetch the order details using an ID from the URL.
  const mockOrder = {
    id: 'BM-12345-2024',
    date: 'October 13, 2025',
    total: '$1062.30',
    shippingAddress: '123 Construction Ave, Buildsville, CA, 12345',
    paymentMethod: 'Visa ending in •••• 1234',
    items: [
      { name: 'Reinforced Steel Rebar (10ft)', quantity: 10, price: '$255.00' },
      { name: 'UltraGrade Portland Cement', quantity: 20, price: '$319.80' },
      { name: 'Construction Grade Lumber (2x4x8)', quantity: 50, price: '$437.50' },
    ],
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-gray-800 p-8 md:p-12 rounded-lg text-center shadow-2xl">
          <div className="mx-auto bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            <Icon path="M5 13l4 4L19 7" className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Thank You For Your Order!</h1>
          <p className="text-gray-300 mb-8">
            Your invoice has been sent to your email. We are preparing your shipment.
          </p>

          <div className="bg-gray-700 p-6 rounded-lg text-left my-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-400">Order ID</span>
              <span className="font-mono text-yellow-400">{mockOrder.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-400">Order Date</span>
              <span className="text-white">{mockOrder.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-400">Order Total</span>
              <span className="font-bold text-2xl text-white">{mockOrder.total}</span>
            </div>
          </div>

          <div className="text-left border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {mockOrder.items.map(item => (
                <div key={item.name} className="flex justify-between">
                  <span className="text-gray-300">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold">Shipping To</h3>
              <p className="text-gray-400">{mockOrder.shippingAddress}</p>
              <h3 className="text-xl font-bold">Payment</h3>
              <p className="text-gray-400">{mockOrder.paymentMethod}</p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/products"
              className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
