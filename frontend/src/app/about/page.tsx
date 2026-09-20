'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Utensils, Leaf, Heart, Calendar } from 'lucide-react';

export default function AboutPage() {
  const philosophyCards = [
    {
      icon: Utensils,
      title: 'Quality Food',
      desc: 'Carefully prepared meals cooked to perfection, honoring time-tested recipes with bold, authentic flavor in every bite.',
    },
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      desc: 'Partnering with local suppliers for natural produce, pasture-raised halal meats, and freshly roasted daily spices.',
    },
    {
      icon: Heart,
      title: 'Warm Hospitality',
      desc: 'Welcoming service and a comfortable atmosphere where every guest is received with genuine respect and warmth.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1 }}>
        {/* =====================================================
            1. HERO SECTION
            Left: Our Story tag, Heading, short paragraph, button
            Right: Large food / restaurant image
        ===================================================== */}
        <section style={{ padding: '120px 20px 70px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '50px',
                alignItems: 'center',
              }}
            >
              {/* Left Column */}
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  Our Story
                </span>

                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(32px, 4.5vw, 48px)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    lineHeight: 1.18,
                    letterSpacing: '-0.5px',
                    marginBottom: '18px',
                  }}
                >
                  A Taste of Tradition, A Place to Belong
                </h1>

                <p
                  style={{
                    fontSize: '15.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                    marginBottom: '28px',
                    maxWidth: '520px',
                  }}
                >
                  Barwaqo Restaurant was created with a simple idea: <strong style={{ color: 'var(--text-primary)' }}>great food should bring people together.</strong> Combining rich East African heritage with contemporary dining in Mogadishu.
                </p>

                <div>
                  <Link
                    href="/menu"
                    prefetch={true}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '13px 28px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-deep)',
                      fontWeight: '700',
                      fontSize: '14.5px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>Explore Our Menu</span>
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Big Restaurant / Food Image */}
              <div>
                <div
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                    position: 'relative',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80"
                    alt="Barwaqo Restaurant Dining Hall"
                    style={{
                      width: '100%',
                      height: '380px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(5,5,5,0.7) 100%)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            2. OUR STORY (2-column layout)
            Left: restaurant / food image
            Right: Sheekada Barwaqo + Since 2024 badge
        ===================================================== */}
        <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '50px',
                alignItems: 'center',
              }}
            >
              {/* Left Column: Food / Dish Image */}
              <div>
                <div
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(212, 165, 116, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80"
                    alt="Barwaqo Spiced Somali Delicacies"
                    style={{
                      width: '100%',
                      height: '420px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Sheekada Barwaqo */}
              <div>
                {/* Small Badge: Since 2024 */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 14px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(212, 165, 116, 0.12)',
                    border: '1px solid rgba(212, 165, 116, 0.3)',
                    color: 'var(--accent)',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}
                >
                  <Calendar size={13} />
                  <span>Since 2024</span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 3.5vw, 38px)',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    lineHeight: 1.25,
                    marginBottom: '18px',
                  }}
                >
                  Our Story
                </h2>

                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
                  Inspired by the warmth of Somali hospitality and the rich flavors of East African cuisine, Barwaqo combines traditional recipes with a modern dining experience. From carefully prepared local dishes to flavorful international favorites, every meal is made with attention to quality, freshness, and taste.
                </p>

                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
                  Our story began with a passion for creating a place where people could come together, enjoy delicious food, and feel at home. Whether you're having lunch with family, meeting friends, celebrating a special moment, or simply enjoying a quiet meal, Barwaqo is designed to make every visit memorable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            3. OUR PHILOSOPHY (Three Cards)
            - Quality Food
            - Fresh Ingredients
            - Warm Hospitality
        ===================================================== */}
        <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ marginBottom: '40px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--accent)',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Our Values
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(26px, 3.5vw, 36px)',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Our Philosophy
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px', lineHeight: 1.6 }}>
                At Barwaqo, we believe that a restaurant is more than just a place to eat. <strong style={{ color: 'var(--accent)' }}>It is a place where moments are shared.</strong>
              </p>
            </div>

            {/* 3 Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {philosophyCards.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '18px',
                    padding: '32px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(212, 165, 116, 0.12)',
                      border: '1px solid rgba(212, 165, 116, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      marginBottom: '6px',
                    }}
                  >
                    <card.icon size={26} />
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '19px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {card.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            4. MISSION SECTION (Background xoogaa dark ah)
            “Our mission is to bring people together through food, hospitality, and memorable experiences.”
        ===================================================== */}
        <section
          style={{
            padding: '85px 20px',
            backgroundColor: 'var(--bg-deep)',
            borderBottom: '1px solid rgba(212, 165, 116, 0.15)',
          }}
        >
          <div className="container" style={{ maxWidth: '820px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--accent)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Our Mission
            </span>

            <blockquote
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                margin: '0 0 20px 0',
                borderLeft: '3px solid var(--accent)',
                paddingLeft: '22px',
              }}
            >
              “Our mission is to bring people together through food, hospitality, and memorable experiences.”
            </blockquote>

            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, paddingLeft: '25px', margin: 0 }}>
              We continue to improve our menu, our service, and our dining atmosphere while staying connected to the flavors and hospitality that inspired Barwaqo from the beginning.
            </p>
          </div>
        </section>

        {/* =====================================================
            5. CTA SECTION
            Come Hungry. Leave Happy.
            Experience Barwaqo Restaurant.
        ===================================================== */}
        <section style={{ padding: '80px 20px' }}>
          <div className="container">
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '48px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: 'var(--accent)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Come Hungry. Leave Happy.
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(26px, 3.5vw, 36px)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                  }}
                >
                  Experience Barwaqo Restaurant.
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '580px', lineHeight: 1.6 }}>
                  Whether you are joining us for dining in Mogadishu or ordering fresh dishes delivered to your door, our kitchen is ready to welcome you.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '6px' }}>
                <Link
                  href="/menu"
                  prefetch={true}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Explore Menu</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/reservations"
                  prefetch={true}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    color: 'var(--accent)',
                    fontWeight: '600',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Book a Table</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
