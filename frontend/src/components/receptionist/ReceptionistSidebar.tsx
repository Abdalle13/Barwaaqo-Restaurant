'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  TableProperties,
  ShoppingBag,
  Monitor,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface ReceptionistSidebarProps {
  onCloseMobile?: () => void;
}

const navGroups = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', href: '/receptionist', icon: LayoutDashboard },
      { name: 'POS', href: '/receptionist/pos', icon: Monitor },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Reservations', href: '/receptionist/reservations', icon: CalendarCheck },
      { name: 'Dining Tables', href: '/receptionist/tables', icon: TableProperties },
      { name: 'Orders', href: '/receptionist/orders', icon: ShoppingBag },
    ],
  },
];

export default function ReceptionistSidebar({ onCloseMobile }: ReceptionistSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 12px',
        zIndex: 40,
        flexShrink: 0,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div>
        {/* Brand — identical to AdminSidebar */}
        <div style={{ padding: '0 8px 20px 8px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px var(--accent-glow)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '19px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  lineHeight: 1,
                }}
              >
                B
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '17px',
                  fontWeight: '700',
                  letterSpacing: '0.6px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                Barwaaqo
              </span>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--accent)', letterSpacing: '1.8px', textTransform: 'uppercase', marginTop: '1px', display: 'block' }}>
                Receptionist
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 12px 4px', margin: 0 }}>
                {group.label}
              </p>
              {group.items.map((item) => {
                const isActive = item.href === '/receptionist'
                  ? pathname === '/receptionist'
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      minWidth: 0,
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--accent-muted)' : 'transparent',
                      border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.18s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <Icon size={16} color={isActive ? 'var(--accent)' : 'currentColor'} />
                    <span style={{ flexGrow: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </span>
                    {isActive && <ChevronRight size={13} color="var(--accent)" style={{ flexShrink: 0 }} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: User Card — identical to AdminSidebar */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-deep)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
              {user?.name || 'Receptionist'}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Receptionist
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-surface)',
                color: 'var(--text-primary)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                border: '1px solid rgba(248, 113, 113, 0.2)', background: 'var(--bg-surface)',
                color: 'var(--danger)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
