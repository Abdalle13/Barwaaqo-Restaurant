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
  ChevronDown,
  CalendarCheck,
  ChevronRight,
  Star,
  Clock,
  Sparkles,
  UtensilsCrossed,
  CreditCard,
  CheckCircle2,
  Users,
  ShieldCheck,
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
            1. HERO SECTION — Centered, Modern Luxury
            ============================================ */}
        <section
          style={{
            position: 'relative',
            minHeight: '92vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingTop: 'clamp(90px, 15vw, 130px)',
            paddingBottom: 'clamp(50px, 10vw, 90px)',
          }}
        >
          {/* Background image with subtle zoom */}
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
              maxWidth: '880px',
              padding: '0 clamp(16px, 4vw, 24px)',
            }}
          >
            {/* Tagline Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(212, 165, 116, 0.12)',
                border: '1px solid rgba(212, 165, 116, 0.3)',
                color: 'var(--accent)',
                fontSize: 'clamp(12px, 2.5vw, 13px)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={14} />
              <span>Authentic Somali Fine Dining</span>
            </div>

            {/* Main Headline with responsive typography */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 6.5vw, 64px)',
                fontWeight: '800',
                lineHeight: '1.15',
                marginBottom: '20px',
                color: '#F5F0EB',
                letterSpacing: '-0.5px',
              }}
            >
              A Taste of Heritage &{' '}
              <span style={{ color: 'var(--accent)', display: 'inline-block' }}>
                Modern Elegance
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(15px, 2.2vw, 18px)',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                marginBottom: '38px',
                maxWidth: '660px',
              }}
            >
              Immerse yourself in authentic Somali flavors: slow-simmered tender cuts, aromatic cardamom basmati rice, and handcrafted spices prepared with generational passion.
            </p>

            {/* Hero CTAs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
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
                  padding: '14px 30px',
                  borderRadius: '12px',
                  background: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 22px rgba(212, 165, 116, 0.38)',
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
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(212, 165, 116, 0.35)',
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
          </div>

          {/* Scroll Down Hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
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
            2. POPULAR DISHES SHOWCASE (EXACTLY 4 DISHES)
            ============================================ */}
        <section style={{ padding: 'clamp(50px, 8vw, 85px) 0', borderTop: '1px solid var(--border)' }}>
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
                    fontSize: 'clamp(26px, 4vw, 36px)',
                    fontWeight: '800',
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
            3. THE BARWAAQO EXPERIENCE (3 CORE PILLARS)
            ============================================ */}
        <section
          style={{
            padding: 'clamp(50px, 8vw, 85px) 0',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
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
                Culinary Mastery
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(26px, 4vw, 36px)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                The Barwaaqo Difference
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                From our natural charcoal grills to centuries-old Xawaash spice blends, experience true culinary distinction.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  icon: <Flame size={24} />,
                  title: 'Cooked Over Real Charcoal',
                  desc: 'Every cut of meat and dish is grilled over natural coals for deep, authentic smoky aromas and tender texture.',
                },
                {
                  icon: <Award size={24} />,
                  title: 'Generational Xawaash Recipes',
                  desc: 'Crafted with Somali cinnamon, cloves, cumin, and cardamom roasted fresh every single morning by our head chefs.',
                },
                {
                  icon: <Truck size={24} />,
                  title: 'Live Delivery Tracking',
                  desc: 'Follow your food with real-time updates from chef preparation straight to your gate across all Mogadishu districts.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: 'clamp(22px, 4vw, 32px)',
                    backgroundColor: 'var(--bg-deep)',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                    transition: 'transform 0.25s ease, border-color 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'rgba(212, 165, 116, 0.12)',
                      border: '1px solid rgba(212, 165, 116, 0.3)',
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
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            4. HOW IT WORKS (3 SIMPLE STEPS)
            ============================================ */}
        <section style={{ padding: 'clamp(50px, 8vw, 85px) 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 48px auto' }}>
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
                Seamless Dining
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(26px, 4vw, 36px)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                How It Works
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                Ordering your favorite meal or booking a table at Barwaaqo is quick and simple.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  step: '01',
                  icon: <UtensilsCrossed size={24} />,
                  title: 'Choose Your Favorites',
                  desc: 'Pick from our freshly prepared Somali dishes, wood-fired meats, aromatic spiced rice, and freshly made fruit juices.',
                },
                {
                  step: '02',
                  icon: <CreditCard size={24} />,
                  title: 'Pay with EVC Plus or eDahab',
                  desc: 'Confirm your order with quick mobile money payment using Hormuud EVC Plus or Dahabshiil eDahab right from your phone.',
                },
                {
                  step: '03',
                  icon: <Truck size={24} />,
                  title: 'Fast Delivery or Reserved Table',
                  desc: 'Have your meal delivered hot to your doorstep anywhere in Mogadishu, or walk into the restaurant with your table ready.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    padding: 'clamp(24px, 4vw, 32px)',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '20px',
                      fontSize: '38px',
                      fontWeight: '900',
                      color: 'rgba(212, 165, 116, 0.1)',
                      fontFamily: 'var(--font-heading)',
                      userSelect: 'none',
                    }}
                  >
                    {item.step}
                  </span>

                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(212, 165, 116, 0.12)',
                      border: '1px solid rgba(212, 165, 116, 0.25)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            5. OUR PHILOSOPHY SECTION (UPGRADED HEADER)
            ============================================ */}
        <section
          style={{
            padding: 'clamp(50px, 8vw, 85px) 0',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="container">
            {/* Prominent Section Header */}
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
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
                Our Heritage & Vision
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(26px, 4vw, 36px)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Our Philosophy
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                Where generational Somali warmth harmonizes with culinary perfection and modern hospitality.
              </p>
            </div>

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
                    height: 'clamp(260px, 40vw, 400px)',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-16px',
                    right: '16px',
                    backgroundColor: 'var(--bg-deep)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>Mogadishu, Somalia</p>
                  <p style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--accent)', margin: '2px 0 0 0' }}>Maka Al-Mukarama Road</p>
                </div>
              </div>

              {/* Right Story Content */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(22px, 3.5vw, 30px)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                    lineHeight: 1.25,
                  }}
                >
                  Generational Passion in Every Single Plate
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
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

        {/* ============================================
            6. PRIVATE DINING & CATERING EVENTS
            ============================================ */}
        <section style={{ padding: 'clamp(50px, 8vw, 85px) 0' }}>
          <div className="container">
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(212, 165, 116, 0.25)',
                borderRadius: '24px',
                padding: 'clamp(32px, 6vw, 60px) clamp(20px, 5vw, 50px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '36px',
                alignItems: 'center',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.4)',
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
                    marginBottom: '8px',
                  }}
                >
                  Exclusive Experiences
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(24px, 3.5vw, 34px)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '14px',
                    lineHeight: 1.25,
                  }}
                >
                  Private Dining & Event Catering
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
                  Planning a family get-together, business lunch, or special celebration? We arrange comfortable reserved tables and personalized group catering tailored to your event.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {[
                    'Comfortable reserved tables for families and groups',
                    'Custom platter menus for gatherings and celebrations',
                    'Attentive table service from our hospitality staff',
                    'Reliable event catering delivered across Mogadishu',
                  ].map((perk, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="/reservations"
                    prefetch={true}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-deep)',
                      fontWeight: '700',
                      fontSize: '14px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(212, 165, 116, 0.35)',
                    }}
                  >
                    <Users size={16} />
                    <span>Reserve a Table</span>
                  </Link>

                  <Link
                    href="/contact"
                    prefetch={true}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Contact Catering</span>
                  </Link>
                </div>
              </div>

              {/* Event Image */}
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
                  alt="Barwaaqo Private Dining Event"
                  style={{
                    width: '100%',
                    height: 'clamp(240px, 35vw, 360px)',
                    objectFit: 'cover',
                    borderRadius: '18px',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            7. GUEST STORIES (TESTIMONIAL MARQUEE)
            ============================================ */}
        <section style={{ padding: 'clamp(50px, 8vw, 85px) 0', overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
                  fontSize: 'clamp(26px, 4vw, 36px)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                What Our Diners Say
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
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
