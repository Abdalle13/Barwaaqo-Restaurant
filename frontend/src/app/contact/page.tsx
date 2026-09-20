'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Navigation,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.emailOrPhone || !formData.message) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/messages', formData);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, paddingTop: '80px' }}>
        {/* Header */}
        <section style={{ padding: '60px 20px 30px 20px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '720px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 4.5vw, 48px)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                marginBottom: '14px',
              }}
            >
              Contact & Location
            </h1>

            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Have questions about catering, private banquets, or dietary preferences? Send us a message or visit our dining hall in Mogadishu.
            </p>
          </div>
        </section>

        {/* Form + Map Grid (Placed above cards) */}
        <section style={{ padding: '0 20px 50px 20px' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                alignItems: 'start',
                marginBottom: '50px',
              }}
            >
              {/* Inquiry Form */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  padding: '36px 30px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Send a Message
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                  Fill out the details below and our management team will reach out within 2 hours.
                </p>

                {submitted ? (
                  <div
                    style={{
                      padding: '28px 20px',
                      backgroundColor: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                      borderRadius: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Message Received!
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                      Mahadsanid! We have received your inquiry and will contact you via phone or email shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', emailOrPhone: '', subject: 'General Inquiry', message: '' });
                      }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--accent)',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Error Message */}
                    {error && (
                      <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#ef4444', fontSize: '14px' }}>
                        {error}
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mahad Farah"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Phone Number or Email
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+252 61 XXX XXXX or email@example.com"
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Private Dining / Banquets">Private Dining / Banquets</option>
                        <option value="Catering Service">Outdoor Catering Service</option>
                        <option value="Food Feedback">Food & Service Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Your Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us how we can assist you..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--accent)',
                        color: 'var(--bg-deep)',
                        fontWeight: '700',
                        fontSize: '15px',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
                        transition: 'opacity 0.2s',
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Map & Directions Visual */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Real Google Maps Embed */}
                  <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.487!2d45.3182!3d2.0469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d58425e07330415%3A0x9e523c1e7a4e16e4!2sKM4%2C%20Maka%20Al-Mukarama%20Road%2C%20Mogadishu%2C%20Somalia!5e0!3m2!1sen!2s!4v1694000000000!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Barwaqo Restaurant Location"
                    />
                  </div>

                  <div style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                      Getting Here
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                      <li style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: '700' }}>•</span>
                        <span>Located directly on Maka Al-Mukarama Road near KM4 intersection.</span>
                      </li>
                      <li style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: '700' }}>•</span>
                        <span>Private secure parking available at the rear entrance.</span>
                      </li>
                      <li style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: '700' }}>•</span>
                        <span>Wheelchair accessible entrance and family dining salons on level 1 & 2.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Quick Reservation Callout */}
                <div
                  style={{
                    backgroundColor: 'rgba(212, 165, 116, 0.08)',
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' }}>
                      Planning a Table Reservation?
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Book your favorite dining table online instantly.
                    </p>
                  </div>

                  <Link
                    href="/reservations"
                    prefetch={true}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-deep)',
                      fontSize: '13px',
                      fontWeight: '700',
                      textDecoration: 'none',
                    }}
                  >
                    Reserve Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Info Cards (Below form) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
                marginTop: '40px',
              }}
            >
              {/* Card 1: Location */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(212, 165, 116, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Dining Location
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                    KM4 Maka Al-Mukarama Road
                    <br />
                    Hodan District, Mogadishu, Somalia
                  </p>
                </div>
              </div>

              {/* Card 2: Phone & WhatsApp */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(74, 222, 128, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success)',
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Phone & WhatsApp
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                    +252 619 157 381
                    <br />
                    +252 683 895 597
                  </p>
                </div>
              </div>

              {/* Card 3: Hours */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(96, 165, 250, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--info)',
                  }}
                >
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Opening Hours
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                    Monday to Sunday (Everyday)
                    <br />
                    08:00 AM to 11:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
