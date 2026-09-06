'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Phone, MapPin, CreditCard, DollarSign, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'evc_plus' | 'cash_on_delivery'>('evc_plus');
  const [notes, setNotes] = useState('');
  const [evcPin, setEvcPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shippingAddress.trim()) {
      setError('Please provide a specific delivery address');
      return;
    }

    if (!paymentPhone.trim()) {
      setError('Please provide a contact/payment phone number');
      return;
    }

    if (paymentMethod === 'evc_plus' && evcPin !== '1234') {
      setError('Demo EVC Plus Pin is 1234. Please enter 1234 to simulate payment confirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          food: item.food._id,
          name: item.food.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentPhone,
        paymentMethod,
        notes,
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setOrderSuccess(res.data.data);
        clearCart();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please make sure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flexGrow: 1, padding: '70px 0' }}>
          <div className="container" style={{ maxWidth: '600px' }}>
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '48px 32px',
                borderTop: '6px solid var(--success)',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <CheckCircle size={38} />
              </div>

              <span className="badge badge-success" style={{ marginBottom: '12px' }}>
                Order Placed Successfully
              </span>

              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                Mahadsanid! Dalabkaagu Wuu Qabsoomay
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>
                Your order is confirmed and our chefs at Barwaaqo are now preparing your delicious meal.
              </p>

              {/* Order Details Badge */}
              <div
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  marginBottom: '28px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Order Tracking ID:</span>
                  <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--primary)' }}>
                    {orderSuccess.orderId}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Payment Method:</span>
                  <span style={{ fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' }}>
                    {orderSuccess.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Paid/Due:</span>
                  <span style={{ fontWeight: '800', fontSize: '16px' }}>
                    ${orderSuccess.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href={`/track?orderId=${orderSuccess.orderId}`} className="btn btn-primary">
                  <span>Track Live Status</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/menu" className="btn btn-secondary">
                  Back to Menu
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '40px 0 80px 0' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              Checkout & Delivery Details
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              Confirm your delivery location and payment option to complete your order.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
              <p style={{ marginBottom: '16px' }}>Your cart is empty.</p>
              <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '36px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left Form: Delivery & Payment Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {error && (
                    <div
                      style={{
                        padding: '14px 18px',
                        backgroundColor: 'var(--danger-light)',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Delivery Location */}
                  <div className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={20} color="var(--primary)" />
                      <span>Delivery Information</span>
                    </h3>

                    <div className="form-group">
                      <label className="form-label">Full Street Address & Landmark *</label>
                      <input
                        type="text"
                        placeholder="e.g. Maka Al-Mukarama Road, Near Sahafi Hotel, KM4"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Phone Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. +252 61 5555555"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Special Delivery Instructions (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Ring the bell twice, or extra banana and basbaas..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="form-textarea"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={20} color="var(--primary)" />
                      <span>Payment Method</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                      {/* EVC Plus Option */}
                      <div
                        onClick={() => setPaymentMethod('evc_plus')}
                        style={{
                          border: '2px solid',
                          borderColor: paymentMethod === 'evc_plus' ? 'var(--primary)' : 'var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          cursor: 'pointer',
                          backgroundColor: paymentMethod === 'evc_plus' ? 'var(--primary-light)' : 'var(--bg-surface)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Phone size={18} color="var(--primary)" />
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>EVC Plus</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Hormuud EVC Mobile Money (Simulated)
                        </p>
                      </div>

                      {/* Cash on Delivery */}
                      <div
                        onClick={() => setPaymentMethod('cash_on_delivery')}
                        style={{
                          border: '2px solid',
                          borderColor: paymentMethod === 'cash_on_delivery' ? 'var(--primary)' : 'var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          cursor: 'pointer',
                          backgroundColor: paymentMethod === 'cash_on_delivery' ? 'var(--primary-light)' : 'var(--bg-surface)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <DollarSign size={18} color="var(--success)" />
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>Cash On Delivery</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Pay with cash upon meal delivery
                        </p>
                      </div>
                    </div>

                    {/* EVC Plus Simulated Pin Input */}
                    {paymentMethod === 'evc_plus' && (
                      <div
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-muted)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label className="form-label" style={{ marginBottom: 0 }}>
                            Enter EVC Demo PIN (Demo: 1234)
                          </label>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>
                            PIN: 1234
                          </span>
                        </div>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="Enter 1234"
                          value={evcPin}
                          onChange={(e) => setEvcPin(e.target.value)}
                          className="form-input"
                          style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '18px', fontWeight: '800' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Order Summary */}
                <div className="card" style={{ position: 'sticky', top: '100px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
                    Order Review
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {items.map((it) => (
                      <div key={it.food._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {it.quantity}x {it.food.name}
                        </span>
                        <span style={{ fontWeight: '600' }}>${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Service Tax (5%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        borderTop: '1px solid var(--border)',
                        paddingTop: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Total Amount</span>
                      <span style={{ color: 'var(--primary)' }}>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    {isSubmitting ? 'Placing Order...' : `Pay & Place Order ($${totalAmount.toFixed(2)})`}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
