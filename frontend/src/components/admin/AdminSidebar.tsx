'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  FolderTree,
  TableProperties,
  CalendarCheck,
  Settings,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Live Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Food Menu', href: '/admin/menu', icon: Utensils },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Dining Tables', href: '/admin/tables', icon: TableProperties },
    { name: 'Reservations', href: '/admin/reservations', icon: CalendarCheck },
    { name: 'Restaurant Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <Link href="/" prefetch={false} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Utensils size={20} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', display: 'block', lineHeight: 1 }}>
                BARWAAQO
              </span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '1px' }}>
                ADMIN PORTAL
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span style={{ flexGrow: 1 }}>{item.name}</span>
                {isActive && <ChevronRight size={14} color="var(--primary)" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & System Controls */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        {/* Customer Site Preview Link */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
            transition: 'color 0.2s',
          }}
        >
          <ExternalLink size={16} />
          <span>View Customer Site</span>
        </Link>

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Administrator'}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
              Super Admin
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              aria-label="Logout"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--bg-surface)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
