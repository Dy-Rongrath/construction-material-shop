'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/hooks';

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

// Cart Item Component
const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: { id: string; name: string; price: number; quantity: number; imageUrl: string };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) => {
  const handleDecrease = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border-b border-gray-700">
      <div className="relative w-32 h-32">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          unoptimized
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-bold text-white">{item.name}</h3>
        <p className="text-gray-400">Unit Price: ${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-600 rounded-lg">
          <button onClick={handleDecrease} className="px-3 py-1 hover:bg-gray-700">
            -
          </button>
          <span className="px-4 py-1">{item.quantity}</span>
          <button onClick={handleIncrease} className="px-3 py-1 hover:bg-gray-700">
            +
          </button>
        </div>
        <p className="text-xl font-bold text-white w-24 text-center">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </button>
      </div>
    </div>
  );
};

// Main Shopping Cart Page Component
export default function CartPage() {
  const { state, dispatch } = useCart();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const subtotal = state.total;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-10">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Items ({state.itemCount})</h2>
            {state.items.length > 0 ? (
              <div className="space-y-4">
                {state.items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Your cart is empty.</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800 p-6 rounded-lg sticky top-28">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Est. Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-white text-xl border-t border-gray-700 pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="mt-8 w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
              <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
