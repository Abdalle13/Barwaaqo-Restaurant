'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  taxPercentage: number;
  deliveryFee: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: string;
  allowReservations: boolean;
  allowOnlineOrders: boolean;
}

const defaultSettings: RestaurantSettings = {
  restaurantName: 'Barwaqo Restaurant',
  tagline: 'Modern Dining & Authentic Flavors',
  currency: 'USD',
  currencySymbol: '$',
  taxPercentage: 5,
  deliveryFee: 2.0,
  contactEmail: 'contact@barwaaqorestaurant.com',
  contactPhone: '+252 61 0000000',
  address: 'KM4 Maka Al-Mukarama Road, Mogadishu, Somalia',
  openingHours: 'Mon - Sun: 08:00 AM - 11:00 PM',
  allowReservations: true,
  allowOnlineOrders: true,
};

interface SettingsContextType {
  settings: RestaurantSettings;
  isLoading: boolean;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  refreshSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = useCallback(() => {
    api.get('/settings')
      .then((res) => {
        if (res.data.success && res.data.data) {
          setSettings({ ...defaultSettings, ...res.data.data });
        }
      })
      .catch(() => {
        // Silently fall back to defaults if settings endpoint fails
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
