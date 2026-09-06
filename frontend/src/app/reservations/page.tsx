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
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '50px 0 90px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '10px',
              }}
            >
              <Utensils size={14} />
              <span>Hospitality & Fine Dining</span>
            </span>
            <h1 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '8px' }}>
              Book Your Table at Barwaaqo
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              Reserve your dining table online. Receive instant confirmation and guaranteed seating.
            </p>
          </div>

          {isSuccess ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '60px 30px',
                borderTop: '6px solid var(--success)',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
                Reservation Request Received!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px auto' }}>
                Thank you, <strong>{customerName}</strong>. We have booked a table for <strong>{guests} guests</strong> on{' '}
                <strong>{reservationDate}</strong> at <strong>{reservationTime}</strong>. A confirmation email has been sent to{' '}
                <strong>{customerEmail}</strong>.
              </p>
              <button onClick={() => setIsSuccess(false)} className="btn btn-primary" style={{ margin: '0 auto' }}>
                Make Another Booking
              </button>
            </div>
          ) : (
            <div className="card" style={{ padding: '36px' }}>
              {error && (
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: 'var(--danger-light)',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '20px',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Abdi Mohamed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. abdi@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. +252 61 0000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Number of Guests *</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="form-select"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Reservation Date *</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Preferred Time Slot *</label>
                    <select
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="form-select"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <label className="form-label">Special Requests or Occasion</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Birthday celebration, window seat preference, quiet corner..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  {isSubmitting ? 'Confirming Booking...' : 'Reserve Table Now'}
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
