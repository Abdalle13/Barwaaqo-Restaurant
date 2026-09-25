'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import {
  ShoppingBag,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  Home,
  UtensilsCrossed,
  Info,
  CalendarCheck,
  Phone,
  Package,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Reservations', href: '/reservations', icon: CalendarCheck },
    { name: 'Contact', href: '/contact', icon: Phone },
    ...(user ? [{ name: 'My Orders', href: '/orders', icon: Package }] : []),
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? 'var(--bg-glass)' : 'var(--bg-base)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: '1px solid var(--border)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            gap: '8px',
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            prefetch={true}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #D47151 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 12px var(--accent-glow)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  lineHeight: 1,
                }}
              >
                B
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: 'clamp(17px, 3.8vw, 21px)',
                  fontWeight: '700',
                  letterSpacing: '0.8px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                Barwaaqo
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  letterSpacing: '2.6px',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  marginTop: '1px',
                }}
              >
                Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '13.5px',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    position: 'relative',
                    padding: '6px 0',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--accent)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {/* Cart Trigger */}
            <Link
              href="/cart"
              prefetch={true}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={16} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontSize: '10px',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop-only: User Controls (Sign In / Register or Profile + Logout) */}
            {user ? (
              <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
                <Link
                  href="/profile"
                  prefetch={true}
                  title="My Profile"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <UserIcon size={15} />
                </Link>

                <button
                  onClick={logout}
                  aria-label="Logout"
                  title="Logout"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                    background: 'rgba(248, 113, 113, 0.05)',
                    color: 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
                <Link
                  href="/login"
                  prefetch={true}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  prefetch={true}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '13px',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              className="mobile-toggle"
            >
              {mobileMenuOpen ? <X size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 98,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(300px, 85vw)',
          zIndex: 99,
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.35)',
          overflowY: 'auto',
        }}
        className="mobile-drawer"
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #D47151 100%)',
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
                  fontSize: '18px',
                  fontWeight: '700',
                  letterSpacing: '0.6px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                Barwaaqo
              </span>
              <span
                style={{
                  fontSize: '8.5px',
                  fontWeight: '700',
                  letterSpacing: '2.4px',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  marginTop: '1px',
                }}
              >
                Restaurant
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-deep)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'var(--accent-muted)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--accent-border)' : 'transparent'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer — User Auth Controls */}
        <div
          style={{
            padding: '14px 12px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {user ? (
            <>
              {/* User info */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-deep)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  marginBottom: '4px',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {user.name || 'Account'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {user.email || user.phone}
                </p>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                <UserIcon size={16} color="var(--accent)" />
                My Profile
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(248, 113, 113, 0.06)',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                  color: 'var(--danger)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 14px var(--accent-glow)',
                }}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
