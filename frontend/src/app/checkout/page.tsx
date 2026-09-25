'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Phone, MapPin, DollarSign, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';

interface ConfirmedOrderItem {
  food: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [district, setDistrict] = useState('');
  const [landmark, setLandmark] = useState('');
  const [orderType, setOrderType] = useState<'' | 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN'>('DELIVERY');
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'evc_plus' | 'edahab' | 'pay_on_delivery'>('evc_plus');
  const [notes, setNotes] = useState('');
  const [evcPin, setEvcPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [confirmedItems, setConfirmedItems] = useState<ConfirmedOrderItem[]>([]);
  const orderDeliveryFee = orderType === 'DELIVERY' ? deliveryFee : 0;
  const orderTotal = subtotal + orderDeliveryFee + tax;

  const mogadishuDistricts = [
    'Hodan',
    'Waaberi',
    'Wadajir',
    'Kaaraan',
    'Dayniile',
    'Shibis',
    'Boondheere',
    'Cabdicasis',
    'Xamarweyne',
    'Xamarjajab',
    'Yaaqshiid',
    'Dharkenley',
    'Kaxda',
    'Shangani',
    'Howlwadaag',
    'Warta Nabadda',
  ];

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login');
    }
  }, [isAuthLoading, user, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!orderType) {
      setError('Please choose an Order Type / Fadlan dooro nooca dalabka');
      return;
    }

    if (orderType === 'DELIVERY' && !district) {
      setError('Please select your District / Fadlan dooro degmadaada');
      return;
    }

    if (!paymentPhone.trim()) {
      setError('Please provide a contact/payment phone number');
      return;
    }

    if ((paymentMethod === 'evc_plus' || paymentMethod === 'edahab') && evcPin !== '1234') {
      setError(`Demo ${paymentMethod === 'evc_plus' ? 'EVC Plus' : 'eDahab'} PIN is 1234. Please enter 1234 to simulate payment confirmation.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsToOrder = items.map((item) => ({
        food: item.food._id,
        name: item.food.name,
        quantity: item.quantity,
        price: item.price,
        image: item.food.image,
      }));

      const resolvedAddress = orderType === 'DELIVERY'
        ? (landmark.trim() ? `Degmada ${district} - ${landmark.trim()}` : `Degmada ${district}`)
        : orderType === 'DINE_IN'
        ? (landmark.trim() ? `Dine-in: ${landmark.trim()}` : 'Dine-in at Restaurant')
        : 'Takeaway Counter';

      const orderPayload = {
        items: itemsToOrder.map((it) => ({
          food: it.food,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
        district: orderType === 'DELIVERY' ? district : undefined,
        landmark: landmark.trim() || undefined,
        shippingAddress: resolvedAddress,
        paymentPhone,
        alternativePhone: alternativePhone.trim() || undefined,
        paymentMethod,
        notes,
        orderType,
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setConfirmedItems(itemsToOrder);
        setOrderSuccess(res.data.data);
        if (typeof window !== 'undefined' && res.data.data?.orderId) {
          localStorage.setItem('barwaaqo_last_order_code', res.data.data.orderId);
        }
        clearCart();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please make sure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-deep)', color: 'var(--text-secondary)' }}>
        Checking your account...
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
        <Navbar />
        <main style={{ flexGrow: 1, padding: '120px 0 90px 0' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            <div
              style={{
                textAlign: 'center',
                padding: '48px 36px',
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
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(74, 222, 128, 0.12)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  color: '#4ADE80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                }}
              >
                <CheckCircle size={36} />
              </div>

              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  backgroundColor: 'rgba(74, 222, 128, 0.12)',
                  color: '#4ADE80',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Order Confirmed & In Kitchen
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '26px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Your Meal is Being Prepared!
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '28px', lineHeight: 1.6 }}>
                Mahadsanid! Our culinary team at Barwaaqo is preparing your fresh meal with authentic Somali spices.
              </p>

              {/* What You Ordered Card */}
              <div
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  borderRadius: '18px',
                  border: '1px solid var(--border)',
                  padding: '24px',
                  marginBottom: '28px',
                  textAlign: 'left',
                }}
              >
                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    marginBottom: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  What You Ordered ({confirmedItems.length} items)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                  {confirmedItems.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '10px',
                        borderBottom: idx !== confirmedItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {it.image && (
                          <Image
                            src={it.image}
                            alt={it.name}
                            width={40}
                            height={40}
                            unoptimized
                            loader={({ src }) => src}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                            {it.name}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Qty: {it.quantity} × ${it.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                        ${(it.price * it.quantity).toFixed(2)}
                      </span>
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
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Payment Mode</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                      {orderSuccess.paymentMethod === 'evc_plus'
                        ? 'EVC Plus (Hormuud)'
                        : orderSuccess.paymentMethod === 'edahab'
                        ? 'eDahab (Dahabshiil)'
                        : 'Pay on Delivery (Mobile Money)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivering To</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', maxWidth: '300px', textAlign: 'right' }}>
                      {shippingAddress}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Estimated Arrival</span>
                    <span style={{ color: '#4ADE80', fontWeight: '700' }}>
                      25 - 35 Minutes
                    </span>
                  </div>
                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '10px',
                      marginTop: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '16px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--accent)', fontSize: '18px' }}>
                      ${orderSuccess.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Link
                  href="/orders"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 26px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
                  }}
                >
                  <span>View My Orders</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/menu"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-deep)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  Back to Menu
                </Link>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Order Ref: {orderSuccess.orderId} • Saved to your profile history
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: 'clamp(90px, 15vw, 120px) 0 60px' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Order Finalization
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                marginBottom: '8px',
              }}
            >
              Checkout & Delivery Details
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Confirm your delivery address and instant mobile payment option.
            </p>
          </div>

          {items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                maxWidth: '460px',
                margin: '0 auto',
              }}
            >
              <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Your cart is empty.</p>
              <Link
                href="/menu"
                style={{
                  display: 'inline-flex',
                  padding: '12px 26px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                  gap: '24px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left Form: Delivery & Payment Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Delivery Location */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '20px',
                      border: '1px solid var(--border)',
                      padding: '28px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '19px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <MapPin size={20} color="var(--accent)" />
                      <span>Order Details</span>
                    </h3>

                    <div className="form-group" style={{ marginBottom: '18px' }}>
                      <label className="form-label">Order Type / Nooca Dalabka *</label>
                      <select
                        value={orderType}
                        onChange={(e) => {
                          const nextType = e.target.value as '' | 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN';
                          setOrderType(nextType);
                        }}
                        required
                        className="form-select"
                        style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      >
                        <option value="" disabled>-- Choose Order Type / Dooro Nooca Dalabka --</option>
                        <option value="DELIVERY">Delivery to Home / Office (Geynsi)</option>
                        <option value="TAKEAWAY">Takeaway from Restaurant (Qaadasho)</option>
                        <option value="DINE_IN">Dine-in at Restaurant (Gudaha Maqaayadda)</option>
                      </select>
                    </div>

                    {orderType === 'DELIVERY' ? (
                      <>
                        <div className="form-group" style={{ marginBottom: '18px' }}>
                          <label className="form-label">Mogadishu District / Degmada *</label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            required
                            className="form-select"
                            style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                          >
                            <option value="" disabled>-- Select your District / Dooro Degmadaada --</option>
                            {mogadishuDistricts.map((d) => (
                              <option key={d} value={d} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                                Degmada {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '18px' }}>
                          <label className="form-label">Specific Location / Street or Landmark (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. KM4, Maka Al-Mukarama Road, Sahafi Hotel agtiisa, ama Guri #12"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="form-input"
                            style={{
                              backgroundColor: 'var(--bg-deep)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                      </>
                    ) : orderType === 'DINE_IN' ? (
                      <div className="form-group" style={{ marginBottom: '18px' }}>
                        <label className="form-label">Table Number / Dining Area (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Table 4, Window Side, Terrace"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="form-input"
                          style={{
                            backgroundColor: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'var(--bg-deep)',
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                          fontSize: '13.5px',
                          color: 'var(--text-secondary)',
                          marginBottom: '18px',
                        }}
                      >
                        📍 Dalabkaaga waxaa lagu diyaarin doonaa miiska qaadashada (Takeaway counter).
                      </div>
                    )}

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                        gap: '16px',
                        marginBottom: '18px',
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Primary Phone *</label>
                        <input
                          type="tel"
                          placeholder="e.g. +252 61 5555555"
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          required
                          className="form-input"
                          style={{
                            backgroundColor: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Alternative Phone (Optional)</label>
                        <input
                          type="tel"
                          placeholder="e.g. +252 61 0000000"
                          value={alternativePhone}
                          onChange={(e) => setAlternativePhone(e.target.value)}
                          className="form-input"
                          style={{
                            backgroundColor: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Special Instructions (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Extra basbaas and fresh banana, deliver to 2nd floor..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="form-textarea"
                        style={{
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '20px',
                      border: '1px solid var(--border)',
                      padding: '28px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '19px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <ShieldCheck size={20} color="var(--accent)" />
                      <span>Payment Method</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '12px', marginBottom: '20px' }}>
                      {/* EVC Plus Option */}
                      <div
                        onClick={() => setPaymentMethod('evc_plus')}
                        style={{
                          border: '2px solid',
                          borderColor: paymentMethod === 'evc_plus' ? 'var(--accent)' : 'var(--border)',
                          borderRadius: '14px',
                          padding: '16px',
                          cursor: 'pointer',
                          backgroundColor: paymentMethod === 'evc_plus' ? 'rgba(212, 165, 116, 0.1)' : 'var(--bg-deep)',
                          boxShadow: paymentMethod === 'evc_plus' ? '0 4px 16px var(--accent-glow)' : 'none',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Phone size={18} color="var(--accent)" />
                          <span style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-primary)' }}>EVC Plus</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                          Hormuud Mobile Money (Instant PIN)
                        </p>
                      </div>

                      {/* eDahab Option */}
                      <div
                        onClick={() => setPaymentMethod('edahab')}
                        style={{
                          border: '2px solid',
                          borderColor: paymentMethod === 'edahab' ? '#EAB308' : 'var(--border)',
                          borderRadius: '14px',
                          padding: '16px',
                          cursor: 'pointer',
                          backgroundColor: paymentMethod === 'edahab' ? 'rgba(234, 179, 8, 0.1)' : 'var(--bg-deep)',
                          boxShadow: paymentMethod === 'edahab' ? '0 4px 16px rgba(234, 179, 8, 0.2)' : 'none',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Phone size={18} color="#EAB308" />
                          <span style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-primary)' }}>eDahab</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                          Dahabshiil Wallet (Instant PIN)
                        </p>
                      </div>

                      {/* Pay on Delivery via Mobile Money */}
                      <div
                        onClick={() => setPaymentMethod('pay_on_delivery')}
                        style={{
                          border: '2px solid',
                          borderColor: paymentMethod === 'pay_on_delivery' ? '#4ADE80' : 'var(--border)',
                          borderRadius: '14px',
                          padding: '16px',
                          cursor: 'pointer',
                          backgroundColor: paymentMethod === 'pay_on_delivery' ? 'rgba(74, 222, 128, 0.1)' : 'var(--bg-deep)',
                          boxShadow: paymentMethod === 'pay_on_delivery' ? '0 4px 16px rgba(74, 222, 128, 0.2)' : 'none',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <CheckCircle size={18} color="#4ADE80" />
                          <span style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-primary)' }}>Pay on Delivery</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                          Bixi markuu darawalku yimaado (EVC / eDahab)
                        </p>
                      </div>
                    </div>

                    {/* Instant PIN Input for EVC Plus / eDahab */}
                    {(paymentMethod === 'evc_plus' || paymentMethod === 'edahab') && (
                      <div
                        style={{
                          padding: '18px',
                          borderRadius: '14px',
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label className="form-label" style={{ marginBottom: 0 }}>
                            Enter {paymentMethod === 'evc_plus' ? 'EVC Plus' : 'eDahab'} Demo PIN (Demo: 1234)
                          </label>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: paymentMethod === 'evc_plus' ? 'var(--accent)' : '#EAB308' }}>
                            PIN: 1234
                          </span>
                        </div>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="••••"
                          value={evcPin}
                          onChange={(e) => setEvcPin(e.target.value)}
                          className="form-input"
                          style={{
                            letterSpacing: '8px',
                            textAlign: 'center',
                            fontSize: '22px',
                            fontWeight: '800',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            color: paymentMethod === 'evc_plus' ? 'var(--accent)' : '#EAB308',
                          }}
                        />
                      </div>
                    )}

                    {/* Pay on Delivery Note */}
                    {paymentMethod === 'pay_on_delivery' && (
                      <div
                        style={{
                          padding: '14px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(74, 222, 128, 0.08)',
                          border: '1px solid rgba(74, 222, 128, 0.25)',
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>🛵</span>
                        <span>
                          <strong>Mobile Money on Arrival:</strong> Marka uu darawalku cuntada kuu keeno, waxaad toos ugu wareejinaysaa EVC Plus ama eDahab.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Order Summary */}
                <div
                  style={{
                    position: 'sticky',
                    top: '100px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    padding: '28px',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      marginBottom: '18px',
                    }}
                  >
                    Order Review
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {items.map((it) => (
                      <div key={it.food._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {it.quantity}x {it.food.name}
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          ${(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Delivery Fee</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${orderDeliveryFee.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Service Tax (5%)</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${tax.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        borderTop: '1px solid var(--border)',
                        paddingTop: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Total Amount</span>
                      <span style={{ color: 'var(--accent)', fontSize: '20px' }}>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-deep)',
                      fontWeight: '700',
                      fontSize: '15px',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 6px 24px rgba(212, 165, 116, 0.35)',
                      transition: 'all 0.25s',
                    }}
                  >
                    {isSubmitting ? 'Processing Order...' : `Pay & Place Order ($${orderTotal.toFixed(2)})`}
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
