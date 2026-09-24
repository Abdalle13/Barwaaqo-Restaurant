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
  Shield,
  Zap,
  ChevronDown,
  CalendarCheck,
  ChevronRight,
  Star,
  Quote,
  Clock,
  Heart,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [popularFoods, setPopularFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/foods?limit=4')
      .then((res) => {
        if (res.data.success) {
          // Exactly 4 items
          setPopularFoods(res.data.data.slice(0, 4));
        }
      })
      .catch((err) => console.log('Error fetching popular foods:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const testimonials = [
    {
      name: 'Dr. Amina Warsame',
      role: 'Diplomatic Guest',
      rating: 5,
      comment:
        'The Bariis Iskukaris with slow-braised goat meat took me back to my grandmother kitchen in Mogadishu. The subtle balance of cardamom, cloves and tender meat is truly unmatched.',
    },
    {
      name: 'Farhan Nur',
      role: 'Frequent Diner',
      rating: 5,
      comment:
        'Ordered through the website and paid with EVC Plus. Delivered steaming hot in under 30 minutes! The charcoal grilled Suqaar was flavorful and fresh.',
    },
    {
      name: 'Sofia Lindqvist',
      role: 'Food Enthusiast',
      rating: 5,
      comment:
        'A magnificent dining experience. The hospitality is warm, the ambiance is peaceful and luxurious, and the homemade basbaas hot sauce is pure art.',
    },
    {
      name: 'Ahmed Hassan',
      role: 'Business Traveller',
      rating: 5,
      comment:
        'Coming from Dubai, I did not expect to find this level of culinary refinement in Mogadishu. The lamb sabayad platter is world class. I will be back.',
    },
    {
      name: 'Khadija Mohamed',
      role: 'Local Regular',
      rating: 5,
      comment:
        'I come here every Friday with my family. The xawaash spice aroma alone is worth the trip. Staff always greet us by name and treat us like royalty.',
    },
    {
      name: 'Yusuf Abdi',
      role: 'Food Blogger',
      rating: 5,
      comment:
        'Barwaqo is the definitive guide to Somali fine dining. From the shaah Carbeed to the slow braised hilib, every element reflects pride and deep culinary knowledge.',
    },
    {
      name: 'Layla Ibrahim',
      role: 'First Time Visitor',
      rating: 5,
      comment:
        'My first time visiting and I was blown away. The interior is stunning, the service is impeccable and the food is soul-nourishing. Highly recommend the goat stew.',
    },
    {
      name: 'Omar Salah',
      role: 'Corporate Client',
      rating: 5,
      comment:
        'We hosted our entire regional team dinner here. 30 guests, flawless service, magnificent platters, and a setting that impressed even our international colleagues.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1 }}>
        {/* ============================================
            HERO SECTION — Centered, Modern Luxury
            ============================================ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingTop: 'clamp(80px, 15vw, 120px)',
            paddingBottom: 'clamp(40px, 8vw, 80px)',
          }}
        >
          {/* Background image with Ken Burns zoom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&auto=format&fit=crop&q=90"
              alt="Barwaaqo Signature Cuisine"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                animation: 'kenBurns 25s ease-in-out infinite',
              }}
            />
            {/* Centered dark gradient vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at center, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.92) 80%, rgba(5,5,5,0.98) 100%)',
              }}
            />
            {/* Bottom gradient fade */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '180px',
                background: 'linear-gradient(to top, var(--bg-deep) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* Hero Content — Centered */}
          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '860px',
              padding: '0 20px',
            }}
          >
            {/* Accent Badge */}

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 6vw, 64px)',
                fontWeight: '800',
                lineHeight: '1.15',
                marginBottom: '20px',
                color: '#F5F0EB',
                letterSpacing: '-0.5px',
              }}
            >
              A Taste of Heritage &{' '}
              <span style={{ color: 'var(--accent)' }}>
                Modern Elegance
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                marginBottom: '36px',
                maxWidth: '640px',
              }}
            >
              Immerse yourself in authentic Somali flavors: slow-simmered tender cuts, aromatic cardamom basmati rice, and handcrafted spices prepared with generational passion.
            </p>

            {/* Hero CTAs — Centered */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '44px',
                width: '100%',
              }}
            >
              <Link
                href="/menu"
                prefetch={true}
                className="hero-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(212, 165, 116, 0.35)',
                  transition: 'all 0.25s ease',
                }}
              >
                <span>Explore Menu</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/reservations"
                prefetch={true}
                className="hero-cta-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 26px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(212, 165, 116, 0.3)',
                  color: 'var(--accent)',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease',
                }}
              >
                <CalendarCheck size={18} />
                <span>Reserve a Table</span>
              </Link>
            </div>

            {/* Trust Badges — Centered */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: <Shield size={15} />, text: 'Award-Winning Cuisine' },
                { icon: <Zap size={15} />, text: '30-Min Rapid Delivery' },
                { icon: <Award size={15} />, text: 'Instant EVC Plus Checkout' },
              ].map((badge, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(212, 165, 116, 0.06)',
                    border: '1px solid rgba(212, 165, 116, 0.15)',
                    borderRadius: '9999px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ color: 'var(--accent)', display: 'flex' }}>{badge.icon}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Down Hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Scroll
            </span>
            <ChevronDown size={16} color="var(--accent)" />
          </div>
        </section>

        {/* ============================================
            CORE PILLARS SECTION
            ============================================ */}
        <section style={{ padding: 'clamp(40px, 8vw, 70px) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  icon: <Flame size={22} />,
                  title: 'Cooked Over Real Charcoal',
                  desc: 'Every cut of meat and dish is grilled over natural coals for deep, authentic smoky aromas.',
                },
                {
                  icon: <Award size={22} />,
                  title: 'Generational Xawaash Recipes',
                  desc: 'Crafted with Somali cinnamon, cloves, cumin, and cardamom roasted fresh every morning.',
                },
                {
                  icon: <Truck size={22} />,
                  title: 'Live Delivery Tracking',
                  desc: 'Follow your food with real-time updates from chef preparation straight to your gate.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    padding: '28px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(212, 165, 116, 0.1)',
                      border: '1px solid rgba(212, 165, 116, 0.25)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        marginBottom: '6px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {feature.title}
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            POPULAR DISHES SHOWCASE (EXACTLY 4 DISHES)
            ============================================ */}
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
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Chef Selections
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '32px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                  }}
                >
                  Our Signature Dishes
                </h2>
              </div>

              <Link
                href="/menu"
                prefetch={true}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent)',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                <span>View Complete Menu</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Dishes Grid — 4 dishes */}
            {isLoading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                  gap: '20px',
                }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: '320px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                  gap: '20px',
                }}
              >
                {popularFoods.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============================================
            CULINARY STORY / HERITAGE FEATURE
            ============================================ */}
        <section
          style={{
            padding: 'clamp(40px, 8vw, 80px) 0',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* Left Image Showcase */}
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
                  alt="Barwaaqo Restaurant Dining Atmosphere"
                  style={{
                    width: '100%',
                    height: 'clamp(240px, 40vw, 380px)',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '20px',
                    backgroundColor: 'var(--bg-deep)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mogadishu, Somalia</p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>Maka Al-Mukarama Road</p>
                </div>
              </div>

              {/* Right Story Content */}
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Our Philosophy
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(26px, 3.5vw, 36px)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '18px',
                    lineHeight: 1.25,
                  }}
                >
                  Where Somali Hospitality Meets Culinary Perfection
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '18px' }}>
                  At Barwaaqo Restaurant, dining is an art of hospitality. We celebrate the richness of the Horn of Africa, blending historic trade-route spices with modern techniques.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
                  Whether savoring our signature slow-braised goat, freshly prepared flatbreads, or indulging in coastal seafood, every dish is an invitation to taste home at its finest.
                </p>
                {/* Stats row */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)', display: 'block' }}>100%</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fresh Ingredients</span>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)', display: 'block' }}>25+</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Authentic Recipes</span>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      4.9 <Star size={20} fill="var(--accent)" color="var(--accent)" />
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Guest Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUEST STORIES - Auto-scrolling marquee */}
        <section style={{ padding: '80px 0', overflow: 'hidden' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Guest Stories
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                What Our Diners Say
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
                Honest feedback from our valued customers across Mogadishu and worldwide visitors.
              </p>
            </div>
          </div>

          {/* Marquee track - overflows container intentionally */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                animation: 'marqueeScroll 32s linear infinite',
                width: 'max-content',
              }}
            >
              {/* Duplicate the array so the scroll loops seamlessly */}
              {[...testimonials, ...testimonials].map((t, idx) => {
                const initials = t.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const colors = [
                  { bg: 'rgba(212, 165, 116, 0.18)', color: '#D4A574' },
                  { bg: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA' },
                  { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80' },
                  { bg: 'rgba(248, 113, 113, 0.15)', color: '#F87171' },
                  { bg: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA' },
                  { bg: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24' },
                  { bg: 'rgba(34, 211, 238, 0.15)', color: '#22D3EE' },
                  { bg: 'rgba(212, 165, 116, 0.18)', color: '#D4A574' },
                ];
                const colorSet = colors[idx % colors.length];

                return (
                  <div
                    key={idx}
                    style={{
                      flexShrink: 0,
                      width: '320px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '20px',
                      border: '1px solid var(--border)',
                      padding: '26px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#FBBF24" color="#FBBF24" />
                        ))}
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-primary)',
                          lineHeight: '1.7',
                          fontStyle: 'italic',
                          marginBottom: '20px',
                        }}
                      >
                        "{t.comment}"
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '16px',
                      }}
                    >
                      {/* Initials Avatar */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: colorSet.bg,
                          border: `1px solid ${colorSet.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '15px',
                          color: colorSet.color,
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{t.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <style>{`
            @keyframes marqueeScroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {/* ============================================
            TABLE RESERVATION CTA
            ============================================ */}
        <section style={{ padding: 'clamp(40px, 8vw, 60px) 0 clamp(50px, 10vw, 90px)' }}>
          <div className="container">
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(212, 165, 116, 0.25)',
                borderRadius: '24px',
                padding: 'clamp(28px, 5vw, 50px) clamp(20px, 4vw, 40px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ maxWidth: '540px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Table Reservations
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '28px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginTop: '6px',
                    marginBottom: '10px',
                  }}
                >
                  Plan Your Dining Experience
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6' }}>
                  Secure your preferred booth or terrace seating for celebrations, family dinners, or meetings.
                </p>
              </div>

              <Link
                href="/reservations"
                prefetch={true}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
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
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 520px) {
          .hero-cta-primary, .hero-cta-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
