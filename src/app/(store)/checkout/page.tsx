'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks';
import { useAuth } from '@/lib/auth';

const FormInput = ({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
    />
  </div>
);

export default function CheckoutPage() {
  const { user } = useAuth();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, router]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartState.items.length === 0 && !cartState.isLoading) {
      router.push('/cart');
    }
  }, [cartState.items.length, cartState.isLoading, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in to place an order');
      return;
    }

    if (cartState.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create order via API
      const orderData = {
        items: cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4), // Store only last 4 digits
          expiry: formData.expiry,
        },
        total: cartState.total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Clear cart after successful order
      cartDispatch({ type: 'CLEAR_CART' });

      // Redirect to order confirmation
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to checkout</h1>
          <Link
            href="/auth/login?redirect=/checkout"
            className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
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

  const subtotal = cartState.total;
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-gray-800 p-8 rounded-lg">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    id="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={value => handleInputChange('firstName', value)}
                  />
                  <FormInput
                    label="Last Name"
                    id="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={value => handleInputChange('lastName', value)}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Address"
                      id="address"
                      placeholder="123 Construction Ave"
                      required
                      value={formData.address}
                      onChange={value => handleInputChange('address', value)}
                    />
                  </div>
                  <FormInput
                    label="City"
                    id="city"
                    placeholder="Buildsville"
                    required
                    value={formData.city}
                    onChange={value => handleInputChange('city', value)}
                  />
                  <FormInput
                    label="State / Province"
                    id="state"
                    placeholder="CA"
                    required
                    value={formData.state}
                    onChange={value => handleInputChange('state', value)}
                  />
                  <FormInput
                    label="Zip / Postal Code"
                    id="zip"
                    placeholder="12345"
                    required
                    value={formData.zip}
                    onChange={value => handleInputChange('zip', value)}
                  />
                </div>
              </section>

              {/* Payment Details */}
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Card Number"
                      id="cardNumber"
                      placeholder="•••• •••• •••• ••••"
                      required
                      value={formData.cardNumber}
                      onChange={value => handleInputChange('cardNumber', value)}
                    />
                  </div>
                  <FormInput
                    label="Expiration Date"
                    id="expiry"
                    placeholder="MM / YY"
                    required
                    value={formData.expiry}
                    onChange={value => handleInputChange('expiry', value)}
                  />
                  <FormInput
                    label="CVC"
                    id="cvc"
                    placeholder="•••"
                    required
                    value={formData.cvc}
                    onChange={value => handleInputChange('cvc', value)}
                  />
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting || cartState.isLoading}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800 p-8 rounded-lg sticky top-28">
            <h2 className="text-2xl font-bold mb-6">Your Order</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartState.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        unoptimized
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <span className="block">{item.name}</span>
                      <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-gray-600 pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
