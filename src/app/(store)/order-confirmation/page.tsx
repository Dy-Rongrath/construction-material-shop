'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const orderData = await response.json();
        setOrder(orderData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error || 'Order not found'}</div>
          <Link
            href="/products"
            className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

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
              <span className="font-mono text-yellow-400">#{order.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-400">Order Date</span>
              <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-400">Order Total</span>
              <span className="font-bold text-2xl text-white">${order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-400">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'Delivered'
                    ? 'bg-green-500/20 text-green-400'
                    : order.status === 'Shipped'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="text-left border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-300">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold">Shipping To</h3>
              <p className="text-gray-400">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <h3 className="text-xl font-bold">Payment</h3>
              <p className="text-gray-400">Payment processed securely</p>
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
