'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type KhqrResponse = {
  qrDataUrl: string;
  payload: string;
  amount: string;
  merchant: string;
  account: string;
};

function KhqrContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  const [data, setData] = useState<KhqrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const POLL_MS = useMemo(() => 4000, []);
  const POLL_TIMEOUT_MS = useMemo(() => 10 * 60 * 1000, []); // 10 minutes
  const [pollStartedAt, setPollStartedAt] = useState<Date | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const loadQr = async () => {
      if (!orderId) {
        setError('Missing order ID');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/payments/khqr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        if (!res.ok) throw new Error('Failed to generate KHQR');
        const json = (await res.json()) as KhqrResponse;
        setData(json);
        setPolling(true);
        setPollStartedAt(new Date());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load KHQR');
      } finally {
        setLoading(false);
      }
    };
    loadQr();
  }, [orderId]);

  // Poll order status and redirect on confirmation
  useEffect(() => {
    if (!orderId || !polling) return;

    const tick = async () => {
      if (pollStartedAt && Date.now() - pollStartedAt.getTime() >= POLL_TIMEOUT_MS) {
        setPolling(false);
        setTimeoutReached(true);
        return;
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const order = await res.json();
          setLastChecked(new Date());
          if (String(order.status).toUpperCase() === 'CONFIRMED') {
            router.push(`/order-confirmation?orderId=${orderId}`);
          }
        }
      } catch {
        // ignore transient failures
      }
    };

    intervalRef.current = setInterval(tick, POLL_MS);
    // immediate first check
    tick();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId, polling, POLL_MS, POLL_TIMEOUT_MS, pollStartedAt, router]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" />
          <p>Generating your KHQR...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error || 'Failed to load KHQR'}</div>
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
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
          <h1 className="text-3xl font-extrabold mb-2">Scan to Pay (KHQR)</h1>
          <p className="text-gray-300 mb-6">Order #{orderId?.slice(-8)}</p>

          <div className="bg-white p-4 rounded-md inline-block mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.qrDataUrl} alt="KHQR" className="w-64 h-64" />
          </div>

          <div className="space-y-1 mb-6">
            <p>
              Amount: <span className="font-bold">${data.amount}</span>
            </p>
            <p>
              Merchant: <span className="font-bold">{data.merchant}</span>
            </p>
            <p>
              Account: <span className="font-mono">{data.account}</span>
            </p>
          </div>

          <div className="text-left bg-gray-700 p-4 rounded-md mb-6">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-1">
              <li>Open your banking app that supports KHQR (e.g., ABA, ACLEDA).</li>
              <li>Choose Scan and point the camera at the QR code.</li>
              <li>Verify the amount and confirm the payment.</li>
              <li>You will receive order confirmation once payment is verified.</li>
            </ol>
            <div className="text-sm text-gray-400 mt-3">
              {polling ? (
                <span>
                  Waiting for payment confirmation{lastChecked ? ` • checked ${lastChecked.toLocaleTimeString()}` : ''}
                </span>
              ) : (
                <span>{timeoutReached ? 'Polling timed out after 10 minutes' : 'Polling paused'}</span>
              )}
            </div>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => {
                  if (polling) {
                    setPolling(false);
                  } else {
                    setTimeoutReached(false);
                    setPollStartedAt(new Date());
                    setPolling(true);
                  }
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-semibold px-3 py-2 rounded"
              >
                {polling ? 'Pause Polling' : 'Resume Polling'}
              </button>
              {timeoutReached && (
                <button
                  onClick={() => {
                    setTimeoutReached(false);
                    setPollStartedAt(new Date());
                    setPolling(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-semibold px-3 py-2 rounded"
                >
                  Retry for 10 more minutes
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href={`/order-confirmation?orderId=${orderId}`}
              className="bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              I’ve Paid – View Confirmation
            </Link>
            <Link
              href="/products"
              className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KhqrPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <KhqrContent />
    </Suspense>
  );
}
