'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  FolderTree,
  TableProperties,
  CalendarCheck,
  Settings,
  Users,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  BarChart3,
  Calculator,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const navGroups = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Admin',
    items: [
      { name: 'Staff Management', href: '/admin/staff', icon: Users },
      { name: 'Customer Management', href: '/admin/users', icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'POS', href: '/admin/pos', icon: Calculator },
      { name: 'Live Orders', href: '/admin/orders', icon: ShoppingBag },
      { name: 'Reservations', href: '/admin/reservations', icon: CalendarCheck },
    ],
  },
  {
    label: 'Menu',
    items: [
      { name: 'Food Items', href: '/admin/menu', icon: Utensils },
      { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    ],
  },
  {
    label: 'Venue',
    items: [
      { name: 'Dining Tables', href: '/admin/tables', icon: TableProperties },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Admin Tools',
    items: [
      { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  
  const [unreadCount, setUnreadCount] = useState(0);
  const isReceptionist = user?.role === 'RECEPTIONIST';
  const visibleNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !isReceptionist || !['/admin/staff', '/admin/reports', '/admin/settings'].includes(item.href)),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/messages');
        if (res.data.success) {
          const count = res.data.data.filter((msg: any) => !msg.isRead).length;
          setUnreadCount(count);
        }
      } catch (error) {
        // Silently ignore — user may not have permission
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

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
        {/* Brand Header */}
        <div style={{ padding: '0 8px 20px 8px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
          <div style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: '700',
                display: 'block',
                letterSpacing: '0.3px',
                color: 'var(--accent)',
                lineHeight: 1.3,
              }}
            >
              {settings.restaurantName}
            </span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px', display: 'block' }}>
              Admin Portal
            </span>
          </div>
        </div>

        {/* Grouped Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {visibleNavGroups.map((group) => (
            <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map((item) => {
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
                      <span style={{
                        flexGrow: 1,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>
                        <span style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}>
                          {item.name}
                        </span>
                        {item.name === 'Messages' && unreadCount > 0 && (
                          <span style={{
                            backgroundColor: 'var(--danger)',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            lineHeight: 1,
                            flexShrink: 0,
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </span>
                      {isActive && <ChevronRight size={13} color="var(--accent)" style={{ flexShrink: 0 }} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: User & Controls */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '12px' }}>
        {/* User Card */}
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
              {user?.name || 'Administrator'}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Admin
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button
              onClick={logout}
              aria-label="Logout"
              title="Sign out"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                background: 'var(--bg-surface)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
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
