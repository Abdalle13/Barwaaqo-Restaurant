'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Settings as SettingsType } from '@/types';
import { Settings, Save, Globe, Phone, Clock, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const { showToast, ToastComponent } = useToast();

  const [settings, setSettings] = useState<SettingsType>({
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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        if (res.data.success && res.data.data) setSettings(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        refreshSettings(); // propagate to Navbar, Footer, Sidebar
        showToast('Settings saved and applied across the site!', 'success');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const sectionCard = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-elevated)' }}>
        {icon}
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{title}</h3>
      </div>
      <div style={{ padding: '22px' }}>{children}</div>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading settings...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Settings size={22} color="var(--accent)" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Restaurant Settings
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Changes here reflect instantly across the entire website (Navbar, Footer, and all pages).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Identity */}
        {sectionCard('Restaurant Identity', <Globe size={16} color="var(--accent)" />, (
          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Restaurant Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text" required value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                style={inputStyle} placeholder="e.g. Barwaqo Restaurant"
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Updates Navbar, Footer, and browser tab</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tagline / Motto</label>
              <input
                type="text" value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                style={inputStyle} placeholder="e.g. Authentic Somali Flavors"
              />
            </div>
          </div>
        ))}

        {/* Financials */}
        {sectionCard('Pricing & Financials', <DollarSign size={16} color="var(--accent)" />, (
          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Currency Code</label>
              <input type="text" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} style={inputStyle} placeholder="USD" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tax Rate (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={settings.taxPercentage} onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Delivery Fee ($)</label>
              <input type="number" step="0.01" min="0" value={settings.deliveryFee} onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })} style={inputStyle} />
            </div>
          </div>
        ))}

        {/* Contact */}
        {sectionCard('Contact Information', <Phone size={16} color="var(--accent)" />, (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Phone Number</label>
                <input type="text" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} style={inputStyle} placeholder="+252 61 0000000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Contact Email</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} style={inputStyle} placeholder="contact@restaurant.com" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Physical Address</label>
              <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} style={{ ...inputStyle }} placeholder="Street, City, Country" />
            </div>
          </div>
        ))}

        {/* Hours */}
        {sectionCard('Operating Hours', <Clock size={16} color="var(--accent)" />, (
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Opening Hours</label>
            <input
              type="text" value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              style={inputStyle} placeholder="Mon - Sun: 08:00 AM - 11:00 PM"
            />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Shown in Footer, Contact page, and reservations</p>
          </div>
        ))}

        {/* Feature Toggles */}
        {sectionCard('Feature Controls', <ToggleRight size={16} color="var(--accent)" />, (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'allowReservations', label: 'Allow Table Reservations', desc: 'Let guests book tables online' },
              { key: 'allowOnlineOrders', label: 'Allow Online Orders', desc: 'Enable the cart and checkout for guests' },
            ].map(({ key, label, desc }) => {
              const value = settings[key as keyof SettingsType] as boolean;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{label}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, [key]: !value })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: value ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.2s' }}
                  >
                    {value ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
              );
            })}
          </div>
        ))}

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit" disabled={isSaving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 32px', borderRadius: '12px', backgroundColor: 'var(--accent)',
              color: 'var(--bg-deep)', fontWeight: '700', fontSize: '15px', border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 18px rgba(212,165,116,0.35)', transition: 'all 0.25s',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save & Apply Changes'}
          </button>
        </div>
      </form>

      {ToastComponent}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
