'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Settings as SettingsType } from '@/types';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsType>({
    restaurantName: 'Barwaaqo Restaurant',
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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading system settings...</div>;
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Restaurant Configuration</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Update operational rules, tax rates, contact details, and restaurant profile
        </p>
      </div>

      <div className="card">
        {success && (
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <CheckCircle size={18} />
            <span>Settings updated successfully!</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline / Motto</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Standard Delivery Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Opening Hours</label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isSaving} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
