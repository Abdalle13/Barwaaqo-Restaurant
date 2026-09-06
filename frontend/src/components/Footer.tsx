'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        paddingTop: '60px',
        paddingBottom: '30px',
        marginTop: '80px',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
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
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800' }}>
                BARWAAQO
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
              Barwaaqo Restaurant brings you the finest dining experience blending rich traditional Somali delicacies
              with modern culinary excellence. Freshness and taste guaranteed.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>
                <Link href="/menu" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color 0.2s' }}>
                  Full Food Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color 0.2s' }}>
                  Table Reservation
                </Link>
              </li>
              <li>
                <Link href="/track" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color 0.2s' }}>
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/cart" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color 0.2s' }}>
                  My Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)' }}>
              Opening Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--primary)" />
                <span>Monday - Sunday</span>
              </div>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>08:00 AM - 11:00 PM</p>
              <p style={{ fontSize: '13px' }}>Breakfast, Lunch, Dinner & Late Dining available everyday.</p>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>KM4 Maka Al-Mukarama Road, Mogadishu, Somalia</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--primary)" />
                <span>+252 61 0000000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--primary)" />
                <span>contact@barwaaqorestaurant.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <p>© {new Date().getFullYear()} Barwaaqo Restaurant. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Crafted with passion for authentic taste.
          </p>
        </div>
      </div>
    </footer>
  );
}
