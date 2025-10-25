'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  login: string;
  name: string | null;
  email: string;
  avatar_url: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from cookies
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie =>
      cookie.trim().startsWith('construction_material_shop_user=')
    );

    if (userCookie) {
      try {
        const userData = userCookie.split('=')[1];
        const user = JSON.parse(decodeURIComponent(userData));
        setUser(user);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        // Clear invalid cookie
        document.cookie =
          'construction_material_shop_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // Redirect to GitHub OAuth
    window.location.href = '/api/auth/github';
  };

  const logout = () => {
    setUser(null);
    // Clear the user cookie
    document.cookie =
      'construction_material_shop_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Here you could also call an API to invalidate the session
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
