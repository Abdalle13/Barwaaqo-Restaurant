'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Food } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (food: Food, quantity?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  deliveryFee: 2.0,
  tax: 0,
  totalAmount: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('barwaaqo_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('barwaaqo_cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (food: Food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.food._id === food._id);
      const effectivePrice = food.discount && food.discount > 0
        ? Math.round(food.price * (1 - food.discount / 100) * 100) / 100
        : food.price;

      if (existing) {
        return prev.map((item) =>
          item.food._id === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity, price: effectivePrice }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food._id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.food._id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('barwaaqo_cart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
  const deliveryFee = items.length > 0 ? 2.0 : 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const totalAmount = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
