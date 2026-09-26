'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  isAdmin: boolean;
  isStaff: boolean;
  isDelivery: boolean;
  isReceptionist: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  isAdmin: false,
  isStaff: false,
  isDelivery: false,
  isReceptionist: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('barwaaqo_token');
    const savedUser = localStorage.getItem('barwaaqo_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify current session with backend in background
        api.get('/auth/me')
          .then((res) => {
            if (res.data.success) {
              setUser(res.data.data);
              localStorage.setItem('barwaaqo_user', JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            // Silently fall back to cached session or re-auth on protected action
          });
      } catch (err) {
        localStorage.removeItem('barwaaqo_token');
        localStorage.removeItem('barwaaqo_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('barwaaqo_token', newToken);
    localStorage.setItem('barwaaqo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('barwaaqo_token');
    localStorage.removeItem('barwaaqo_user');
    localStorage.removeItem('barwaaqo_last_order_code'); // SECURITY: clear order cache on logout
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      localStorage.setItem('barwaaqo_user', JSON.stringify(updated));
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStaff = user?.role === 'ADMIN'; // RECEPTIONIST now has its own portal
  const isDelivery = user?.role === 'DELIVERY';
  const isReceptionist = user?.role === 'RECEPTIONIST';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser, isAdmin, isStaff, isDelivery, isReceptionist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
