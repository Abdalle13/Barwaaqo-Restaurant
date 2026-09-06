'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Order } from '@/types';
import { Search, Clock, CheckCircle2, Truck, ChefHat, XCircle, MapPin, Phone } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('orderId') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (code: string) => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(code.trim().toUpperCase())}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found. Please verify your tracking code (e.g. BW-10293).');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchOrder(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchCode);
  };

  const statusSteps = [
    { label: 'Order Received', status: 'Pending', icon: Clock },
    { label: 'Kitchen Preparing', status: 'Processing', icon: ChefHat },
    { label: 'Out for Delivery', status: 'Out for Delivery', icon: Truck },
    { label: 'Delivered & Completed', status: 'Completed', icon: CheckCircle2 },
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
    <div className="container" style={{ maxWidth: '750px', padding: '40px 20px 80px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
          Live Order Tracking
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
          Enter your unique Barwaaqo order code to track your meal in real-time.
        </p>
      </div>

      {/* Tracking Input Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="e.g. BW-10293"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          className="form-input"
          style={{
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
          required
        />
        <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ flexShrink: 0 }}>
          <Search size={18} />
          <span>{isLoading ? 'Searching...' : 'Track'}</span>
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px',
          }}
        >
          {error}
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="card" style={{ padding: '32px' }}>
          {/* Header */}
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
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tracking ID
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>
                {order.orderId}
              </h3>
            </div>

            <div>
              <span
                className={`badge ${
                  order.status === 'Completed'
                    ? 'badge-success'
                    : order.status === 'Cancelled'
                    ? 'badge-danger'
                    : 'badge-warning'
                }`}
                style={{ fontSize: '13px', padding: '6px 14px' }}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Timeline Visual */}
          {order.status === 'Cancelled' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--danger-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                marginBottom: '24px',
              }}
            >
              <XCircle size={24} />
              <div>
                <p style={{ fontWeight: '700' }}>Order Cancelled</p>
                <p style={{ fontSize: '13px' }}>This order has been cancelled by customer or restaurant.</p>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '36px' }}>
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
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? 'var(--primary)' : 'var(--bg-muted)',
                          color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px',
                          transition: 'all 0.3s',
                          border: isCurrent ? '3px solid var(--primary-glow)' : 'none',
                        }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
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

          {/* Details Summary */}
          <div
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>
              Order Contents ({order.items.length} dishes)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {order.items.map((it: any, index: number) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>
                    {it.quantity}x {typeof it.food === 'object' ? it.food.name : it.name || 'Dish'}
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
                justifyContent: 'space-between',
                fontWeight: '800',
                fontSize: '16px',
              }}
            >
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</span>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border)',
                fontSize: '13px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MapPin size={16} color="var(--primary)" />
              <span>Delivering to: {order.shippingAddress}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading tracking...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
