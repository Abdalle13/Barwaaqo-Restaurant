'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Bike, LogOut, Menu as MenuIcon, X, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/delivery', label: 'My Deliveries', icon: '📦' },
  { href: '/delivery/history', label: 'History', icon: '📋' },
];

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'DELIVERY')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading delivery portal...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'DELIVERY') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Top Navigation Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1 }}>Barwaaqo</div>
              <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Delivery Portal</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '4px' }} className="delivery-nav-desktop">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', fontWeight: '600',
                backgroundColor: pathname === item.href ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                color: pathname === item.href ? '#3B82F6' : 'var(--text-secondary)',
                border: pathname === item.href ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </nav>

          {/* User + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="delivery-nav-mobile" style={{ padding: '0 16px 10px', display: 'flex', gap: '6px' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '12px', fontWeight: '600',
              backgroundColor: pathname === item.href ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-elevated)',
              color: pathname === item.href ? '#3B82F6' : 'var(--text-secondary)',
              border: pathname === item.href ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid var(--border)',
            }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) 20px' }}>
        {children}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .delivery-nav-mobile { display: none !important; }
        @media (max-width: 640px) {
          .delivery-nav-desktop { display: none !important; }
          .delivery-nav-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
