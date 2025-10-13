import React from 'react';
import Image from 'next/image';

const FormInput = ({
  label,
  id,
  type = 'text',
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
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
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
    />
  </div>
);

export default function CheckoutPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-gray-800 p-8 rounded-lg">
            <form className="space-y-8">
              {/* Shipping Information */}
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="First Name" id="firstName" placeholder="John" />
                  <FormInput label="Last Name" id="lastName" placeholder="Doe" />
                  <div className="md:col-span-2">
                    <FormInput label="Address" id="address" placeholder="123 Construction Ave" />
                  </div>
                  <FormInput label="City" id="city" placeholder="Buildsville" />
                  <FormInput label="State / Province" id="state" placeholder="CA" />
                  <FormInput label="Zip / Postal Code" id="zip" placeholder="12345" />
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
                    />
                  </div>
                  <FormInput label="Expiration Date" id="expiry" placeholder="MM / YY" />
                  <FormInput label="CVC" id="cvc" placeholder="•••" />
                </div>
              </section>
            </form>
          </div>

          {/* Order Summary (condensed) */}
          <div className="bg-gray-800 p-8 rounded-lg sticky top-28">
            <h2 className="text-2xl font-bold mb-6">Your Order</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-300">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src="https://placehold.co/100x100/334155/eab308?text=Rebar"
                      alt="Rebar"
                      fill
                      unoptimized
                      className="rounded-md object-cover"
                    />
                  </div>
                  <span>Rebar (x10)</span>
                </div>
                <span>$255.00</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src="https://placehold.co/100x100/334155/eab308?text=Cement"
                      alt="Cement"
                      fill
                      unoptimized
                      className="rounded-md object-cover"
                    />
                  </div>
                  <span>Cement (x20)</span>
                </div>
                <span>$319.80</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src="https://placehold.co/100x100/334155/eab308?text=Lumber"
                      alt="Lumber"
                      fill
                      unoptimized
                      className="rounded-md object-cover"
                    />
                  </div>
                  <span>Lumber (x50)</span>
                </div>
                <span>$437.50</span>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$1012.30</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$50.00</span>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>$1062.30</span>
              </div>
            </div>
            <button className="mt-8 w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
