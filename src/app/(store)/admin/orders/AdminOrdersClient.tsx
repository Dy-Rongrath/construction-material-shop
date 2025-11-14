'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type AdminOrder = {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  user: { id: string; email: string; name: string | null };
  items: Array<{ id: string; quantity: number; price: number; product: { name: string } }>;
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadOrders = useMemo(
    () =>
      async function load() {
        setLoading(true);
        setError(null);
        try {
          const qs = new URLSearchParams();
          if (statusFilter) qs.set('status', statusFilter);
          qs.set('limit', '50');
          const res = await fetch(`/api/admin/orders?${qs.toString()}`);
          if (!res.ok) {
            if (res.status === 403) throw new Error('Forbidden: admin access required');
            throw new Error('Failed to load orders');
          }
          const json = await res.json();
          setOrders(json.orders || []);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load orders');
        } finally {
          setLoading(false);
        }
      },
    [statusFilter]
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const confirmOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/confirm`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to confirm');
      toast.success('Order confirmed');
      await loadOrders();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to confirm');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">Admin • Orders</h1>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-2"
              onClick={() => loadOrders()}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading && <div>Loading orders…</div>}
        {error && <div className="text-red-400">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded border border-gray-800">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map(o => (
                  <tr key={o.id} className="bg-gray-900">
                    <td className="px-4 py-3">
                      <div className="font-semibold">#{o.id.slice(-8)}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{o.user.name || o.user.email}</div>
                      <div className="text-xs text-gray-400">{o.user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          o.status === 'CONFIRMED'
                            ? 'bg-green-500/20 text-green-400'
                            : o.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-600/30 text-gray-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/order-confirmation?orderId=${o.id}`}
                          className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-2 text-sm"
                        >
                          View
                        </Link>
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => confirmOrder(o.id)}
                            className="bg-green-600 hover:bg-green-500 rounded px-3 py-2 text-sm"
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
