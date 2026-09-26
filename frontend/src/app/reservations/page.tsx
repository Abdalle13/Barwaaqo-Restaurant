'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Calendar, Clock, Users, CheckCircle2, Utensils, MessageSquare } from 'lucide-react';

export default function ReservationsPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('19:00');
  const [seatingPreference, setSeatingPreference] = useState('Indoor (AC)');
  const [occasion, setOccasion] = useState('Regular / Casual');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
  ];

  const occasions = [
    'Regular / Casual',
    'Birthday Celebration',
    'Anniversary / Romantic',
    'Business Dinner',
    'Family Gathering',
  ];

  const seatingOptions = [
    'Indoor (AC)',
    'Outdoor Garden',
    'VIP Private Room',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await api.post('/reservations', {
        customerName,
        customerEmail,
        customerPhone,
        guests: Number(guests),
        reservationDate,
        reservationTime,
        seatingPreference,
        occasion,
        specialRequests,
      });

      if (res.data.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit reservation. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: 'clamp(90px, 15vw, 120px) clamp(14px, 4vw, 24px) 60px' }}>
        <div className="container" style={{ maxWidth: '800px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4.5vw, 44px)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
                lineHeight: 1.2,
              }}
            >
              Reserve Your Table at Barwaaqo
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px, 2vw, 15px)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              Whether an intimate evening, family feast, or diplomatic gathering, guarantee your seating with bespoke Somali hospitality.
            </p>
          </div>

          {isSuccess ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'clamp(32px, 6vw, 60px) clamp(16px, 4vw, 36px)',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, var(--accent) 0%, #4ADE80 100%)',
                }}
              />
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(74, 222, 128, 0.12)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  color: '#4ADE80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <CheckCircle2 size={38} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 3.5vw, 26px)',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Reservation Request Confirmed!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', maxWidth: '520px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
                Thank you, <strong style={{ color: 'var(--accent)' }}>{customerName}</strong>. We have booked a table for{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{guests} guests</strong> ({seatingPreference}) on{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{reservationDate}</strong> at{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{reservationTime}</strong>. A confirmation has been registered with{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{customerEmail}</strong>.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
                }}
              >
                Make Another Booking
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: 'clamp(20px, 5vw, 40px)',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
              {error && (
                <div
                  style={{
                    padding: '14px 18px',
                    backgroundColor: 'rgba(248, 113, 113, 0.12)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    color: 'var(--danger)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '24px',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Abdi Mohamed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="form-input"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. abdi@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="form-input"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +252 61 0000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="form-input"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Number of Guests *</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="form-select"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                        <option key={num} value={num} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Reservation Date *</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      required
                      className="form-input"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        colorScheme: 'dark',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Preferred Time Slot *</label>
                    <select
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="form-select"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Seating Area (Optional)</label>
                    <select
                      value={seatingPreference}
                      onChange={(e) => setSeatingPreference(e.target.value)}
                      className="form-select"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    >
                      {seatingOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Occasion / Munaasabadda (Optional)</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="form-select"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    >
                      {occasions.map((occ) => (
                        <option key={occ} value={occ} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Special Requests or Dietary Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Quiet corner, window seating, allergies, or special table decorations..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="form-textarea"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '15px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 24px rgba(212, 165, 116, 0.35)',
                    transition: 'all 0.25s',
                  }}
                >
                  {isSubmitting ? 'Securing Your Table...' : 'Reserve Table Now'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
