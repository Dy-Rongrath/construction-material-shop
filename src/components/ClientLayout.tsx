'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FullPageLoader from '@/components/FullPageLoader';
import { CartProvider } from '@/lib/hooks';
import { AuthProvider } from '@/lib/auth';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {isLoading && <FullPageLoader />}
      </CartProvider>
    </AuthProvider>
  );
}
