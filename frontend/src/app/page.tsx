'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FoodCard from '@/components/FoodCard';
import api from '@/lib/api';
import { Food } from '@/types';
import {
  ArrowRight,
  Flame,
  Award,
  Truck,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const [popularFoods, setPopularFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/foods/popular')
      .then((res) => {
        if (res.data.success) {
          setPopularFoods(res.data.data);
        }
      })
      .catch((err) => console.log('Could not fetch popular foods:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1 }}>
        {/* HERO SECTION */}
        <section
          style={{
            position: 'relative',
            padding: '70px 0 90px 0',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '50px',
                alignItems: 'center',
              }}
            >
              {/* Hero Left Content */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '13px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    border: '1px solid var(--primary-border)',
                  }}
                >
                  <Sparkles size={16} />
                  <span>Welcome to Barwaaqo Restaurant</span>
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    fontWeight: '800',
                    lineHeight: '1.15',
                    marginBottom: '20px',
                    color: 'var(--text-primary)',
                  }}
                >
                  Authentic Taste, <br />
                  <span style={{ color: 'var(--primary)' }}>Modern Dining</span> Experience.
                </h1>

                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                    marginBottom: '32px',
                    maxWidth: '520px',
                  }}
                >
                  Discover the finest Somali traditional cuisine crafted with fresh daily ingredients,
                  fragrant xawaash spices, and culinary mastery. Order online for swift delivery or reserve
                  your table today.
                </p>

                {/* Hero CTAs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <Link href="/menu" className="btn btn-primary btn-lg">
                    <span>Explore Our Menu</span>
                    <ArrowRight size={18} />
                  </Link>

                  <Link href="/reservations" className="btn btn-secondary btn-lg">
                    <CalendarCheck size={18} color="var(--primary)" />
                    <span>Book a Table</span>
                  </Link>
                </div>

                {/* Trust Points */}
                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '36px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--success)" />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      100% Halal Certified
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--success)" />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      Speedy 30-Min Delivery
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--success)" />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      EVC Plus Supported
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Right Visual Presentation */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '420px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=85"
                    alt="Barwaaqo Signature Dish"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '24px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                      color: '#ffffff',
                    }}
                  >
                    <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                      Chef Specialty
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                      Bariis Iskukaris & Roasted Goat (Hilib Ari)
                    </h3>
                    <p style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '4px' }}>
                      Slow-cooked basmati spiced with cinnamon, cardamom and cloves.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES HIGHLIGHT SECTION */}
        <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
              }}
            >
              <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Flame size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                    Fresh Daily Cooking
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Every single dish is freshly cooked on-demand with premium meats and fresh spices.
                  </p>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                    Authentic Recipes
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Heritage recipes passed down through generations for an unforgettable culinary experience.
                  </p>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--info-light)',
                    color: 'var(--info)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Truck size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                    Fast Delivery & Tracking
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Track your order live in real-time from kitchen preparation right to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR DISHES SHOWCASE */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    color: 'var(--primary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Customer Favorites
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px' }}>
                  Popular Signature Dishes
                </h2>
              </div>

              <Link
                href="/menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  fontSize: '15px',
                }}
              >
                <span>View Full Menu</span>
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Dishes Grid */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                Loading delicious dishes...
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '24px',
                }}
              >
                {popularFoods.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RESERVATION CTA BANNER */}
        <section
          style={{
            padding: '70px 0',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                borderRadius: '24px',
                padding: '50px 40px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '30px',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '14px',
                  }}
                >
                  Table Bookings
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
                  Planning an Evening Out or Special Event?
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '15px', lineHeight: '1.6' }}>
                  Reserve your table online in advance. Whether it is an intimate family dinner, a business lunch,
                  or a celebration in our VIP lounge, we guarantee prompt hospitality.
                </p>
              </div>

              <Link
                href="/reservations"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#ea580c',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s',
                  textDecoration: 'none',
                }}
              >
                <span>Book a Table Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
