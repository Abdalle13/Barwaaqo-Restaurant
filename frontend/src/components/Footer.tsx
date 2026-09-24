'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-deep)',
        borderTop: '1px solid var(--border)',
        paddingTop: 'clamp(40px, 8vw, 70px)',
        paddingBottom: '30px',
        transition: 'background-color 0.4s ease',
      }}
    >
      <div className="container">
        {/* Top: Brand + Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(24px, 5vw, 48px)',
            marginBottom: '40px',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  color: 'var(--accent)',
                }}
              >
                {settings.restaurantName}
              </span>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
                lineHeight: '1.75',
                maxWidth: '320px',
              }}
            >
              {settings.tagline || 'Experience the best culinary tradition.'}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {[
                { 
                  label: 'Facebook', 
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, 
                  href: 'https://facebook.com' 
                },
                { 
                  label: 'WhatsApp', 
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, 
                  href: 'https://wa.me/252619157381' 
                },
                { 
                  label: 'TikTok', 
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>, 
                  href: 'https://tiktok.com' 
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    transition: 'all 0.25s ease',
                    textDecoration: 'none',
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                color: 'var(--accent)',
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
              {[
                { name: 'Our Menu', href: '/menu' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Book a Table', href: '/reservations' },
                { name: 'My Orders', href: '/orders' },
                { name: 'Your Cart', href: '/cart' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      transition: 'color 0.2s, transform 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {link.name}
                    <ArrowUpRight size={12} style={{ opacity: 0.4 }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hours */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                color: 'var(--accent)',
              }}
            >
              Opening Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={15} color="var(--accent)" style={{ opacity: 0.7 }} />
                <span>Monday to Sunday</span>
              </div>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px' }}>
                {settings.openingHours}
              </p>
              <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
                Breakfast, Lunch, Dinner and Late Dining, everyday.
              </p>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                color: 'var(--accent)',
              }}
            >
              Visit Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px', opacity: 0.7 }} />
                <span>{settings.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Phone size={15} color="var(--accent)" style={{ marginTop: '3px', opacity: 0.7 }} />
                <span>
                  +252 619 157 381<br />
                  +252 683 895 597
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={15} color="var(--accent)" style={{ opacity: 0.7 }} />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--accent-border), transparent)',
            marginBottom: '24px',
          }}
        />

        {/* Copyright */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
            letterSpacing: '0.3px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <p>© {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.</p>
          <p>
            Built by{' '}
            <a
              href="https://github.com/Abdalle13"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent)',
                fontWeight: '700',
                textDecoration: 'none',
              }}
            >
              Abdalle Hussein
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
