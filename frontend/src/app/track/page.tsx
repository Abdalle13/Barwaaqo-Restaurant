'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { Search, Clock, CheckCircle2, Truck, ChefHat, XCircle, MapPin, Sparkles } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('orderId') || '';
  const { user } = useAuth();

  const [searchCode, setSearchCode] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [noOrders, setNoOrders] = useState(false);

  // Load MY latest order using the authenticated endpoint
  const fetchMyLatestOrder = async () => {
    if (!user) return;
    setIsLoading(true);
    setNoOrders(false);
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        // Find the latest active order first, otherwise fall back to most recent
        const active = res.data.data.find((o: any) =>
          o.status !== 'Cancelled' && o.status !== 'Completed'
        );
        setOrder(active || res.data.data[0]);
        setError('');
        setNoOrders(false);
      } else {
        // User is logged in but has no orders at all
        setOrder(null);
        setNoOrders(true);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  // Search by order code (public route — only used when user explicitly searches)
  const fetchOrderByCode = async (code: string, silent = false) => {
    if (!code.trim()) return;
    setIsLoading(true);
    if (!silent) setError('');
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(code.trim())}`);
      if (res.data.success && res.data.data) {
        // SECURITY: If user is logged in, verify the order belongs to them
        if (user) {
          const returnedUserId =
            typeof res.data.data.user === 'object'
              ? res.data.data.user?._id
              : res.data.data.user;
          if (returnedUserId && returnedUserId.toString() !== user._id.toString()) {
            if (!silent) setError('This order does not belong to your account.');
            setOrder(null);
            return;
          }
        }
        setOrder(res.data.data);
        setError('');
      }
    } catch (err: any) {
      if (!silent) {
        setError(err.response?.data?.message || 'Order not found. Please verify the dish name or order reference.');
      }
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // SECURITY: Always clear stale localStorage to prevent cross-user data leaks
    if (typeof window !== 'undefined') {
      localStorage.removeItem('barwaaqo_last_order_code');
    }

    if (initialCode) {
      fetchOrderByCode(initialCode, false);
      return;
    }

    // For logged-in users: use the authenticated endpoint (returns ONLY their orders)
    if (user) {
      fetchMyLatestOrder();
    }
    // For guests: show nothing — they must search
  }, [user, initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderByCode(searchCode);
  };

  const statusSteps = [
    { label: 'Order Received', status: 'Pending', icon: Clock },
    { label: 'Kitchen Preparing', status: 'Processing', icon: ChefHat },
    { label: 'Out for Delivery', status: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', status: 'Completed', icon: CheckCircle2 },
  ];

  const getStepIndex = (currentStatus: string) => {
    if (currentStatus === 'Cancelled') return -1;
    switch (currentStatus) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Out for Delivery': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '720px', padding: '110px 20px 90px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 38px)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}
        >
          Live Order Status
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Search by dish name or order code to check kitchen and delivery progress.
        </p>
      </div>

      {/* Small & Compact Search Bar */}
      <div style={{ maxWidth: '460px', margin: '0 auto 32px auto' }}>
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '4px 6px 4px 14px',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Search size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search dish name (e.g. Bariis, Goat, Suqaar)..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            style={{
              flexGrow: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              padding: '6px 0',
            }}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              flexShrink: 0,
              padding: '7px 18px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-deep)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto 28px auto',
            padding: '12px 18px',
            backgroundColor: 'rgba(248, 113, 113, 0.12)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            color: 'var(--danger)',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '13.5px',
            fontWeight: '600',
          }}
        >
          {error}
        </div>
      )}

      {/* Empty state — logged in but no orders */}
      {!isLoading && !order && !error && noOrders && user && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <Sparkles size={48} color="var(--accent)" style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            You have not placed any orders yet.
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Browse our menu and place your first order to track it here.
          </p>
          <a
            href="/menu"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-deep)',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Browse Menu
          </a>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div
          style={{
            padding: '30px 26px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header without Technical ID */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '20px',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                Active Order
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                {typeof order.user === 'object' && order.user?.name ? order.user.name : 'Customer'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  backgroundColor:
                    order.status === 'Completed'
                      ? 'rgba(74, 222, 128, 0.12)'
                      : order.status === 'Cancelled'
                      ? 'rgba(248, 113, 113, 0.12)'
                      : 'rgba(251, 191, 36, 0.12)',
                  color:
                    order.status === 'Completed'
                      ? '#4ADE80'
                      : order.status === 'Cancelled'
                      ? '#F87171'
                      : '#FBBF24',
                  border: `1px solid ${
                    order.status === 'Completed'
                      ? 'rgba(74, 222, 128, 0.3)'
                      : order.status === 'Cancelled'
                      ? 'rgba(248, 113, 113, 0.3)'
                      : 'rgba(251, 191, 36, 0.3)'
                  }`,
                }}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Pending Status Alert */}
          {order.status === 'Pending' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                backgroundColor: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                borderRadius: '12px',
                color: '#FBBF24',
                marginBottom: '26px',
                fontSize: '13.5px',
              }}
            >
              <Clock size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  Pending Kitchen Confirmation
                </strong>
                <span>Your order is with the kitchen team and preparing to start shortly.</span>
              </div>
            </div>
          )}

          {/* Timeline Visual */}
          {order.status === 'Cancelled' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px',
                backgroundColor: 'rgba(248, 113, 113, 0.12)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '14px',
                color: 'var(--danger)',
                marginBottom: '28px',
              }}
            >
              <XCircle size={24} />
              <div>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>Order Cancelled</p>
                <p style={{ fontSize: '13px', opacity: 0.9 }}>This order has been cancelled.</p>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  position: 'relative',
                }}
              >
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const IconComponent = step.icon;

                  return (
                    <div
                      key={step.status}
                      style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? 'var(--accent)' : 'var(--bg-deep)',
                          color: isCompleted ? 'var(--bg-deep)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px',
                          border: isCurrent
                            ? '3px solid rgba(212, 165, 116, 0.4)'
                            : '1px solid var(--border)',
                          boxShadow: isCompleted ? '0 4px 16px rgba(212, 165, 116, 0.3)' : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: isCompleted ? '700' : '500',
                          color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Information Card (Always shown, especially for pending) */}
          <div
            style={{
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              padding: '18px 20px',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Customer & Delivery Details
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '13.5px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px' }}>Recipient</span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {typeof order.user === 'object' && order.user?.name ? order.user.name : 'Customer'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px' }}>Contact Phone</span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {order.paymentPhone || (typeof order.user === 'object' && order.user?.phone ? order.user.phone : 'Not specified')}
                </strong>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px' }}>Delivery Address</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', marginTop: '2px' }}>
                  <MapPin size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span>{order.shippingAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dishes Details Summary */}
          <div
            style={{
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              padding: '18px 20px',
            }}
          >
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: '700',
                marginBottom: '14px',
                color: 'var(--text-primary)',
              }}
            >
              What You Ordered ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {order.items.map((it: any, index: number) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {typeof it.food === 'object' && it.food?.image && (
                      <img
                        src={it.food.image}
                        alt={it.name || 'Dish'}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {it.quantity}x {typeof it.food === 'object' ? it.food.name : it.name || 'Dish'}
                    </span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
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
                justifyContent: 'space-between',
                fontWeight: '700',
                fontSize: '15.5px',
                color: 'var(--text-primary)',
              }}
            >
              <span>Total Paid</span>
              <span style={{ color: 'var(--accent)', fontSize: '17px' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--text-secondary)' }}>Loading tracking system...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
