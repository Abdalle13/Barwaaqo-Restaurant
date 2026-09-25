'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Order } from '@/types';
import {
  X,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  XCircle,
  MapPin,
  Receipt,
  Loader2,
} from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  orderId?: string;
}

const statusSteps = [
  { label: 'Order Received', status: 'Pending', icon: Clock },
  { label: 'Kitchen Preparing', status: 'Processing', icon: ChefHat },
  { label: 'Out for Delivery', status: 'Out for Delivery', icon: Truck },
  { label: 'Delivered', status: 'Completed', icon: CheckCircle2 },
];

const getStepIndex = (currentStatus: string) => {
  switch (currentStatus) {
    case 'Pending': return 0;
    case 'Processing': return 1;
    case 'Out for Delivery': return 2;
    case 'Completed': return 3;
    default: return 0;
  }
};

export default function TrackOrderModal({
  isOpen,
  onClose,
  order: propOrder,
  orderId = '',
}: TrackOrderModalProps) {
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrderByCode = useCallback(async (code: string) => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(code.trim())}`);
      if (res.data.success && res.data.data) {
        setFetchedOrder(res.data.data);
        setError('');
      } else {
        setError('Order details could not be found.');
        setFetchedOrder(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found.');
      setFetchedOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (propOrder) {
      setFetchedOrder(propOrder);
      setIsLoading(false);
    } else if (orderId) {
      fetchOrderByCode(orderId);
    } else {
      setFetchedOrder(null);
    }
  }, [isOpen, propOrder, orderId, fetchOrderByCode]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const order = propOrder || fetchedOrder;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-muted)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={18} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Track Order
              </h2>
              {order?.orderId && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Order #{order.orderId}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-deep)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Loader2 size={32} color="var(--accent)" className="animate-spin" />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Loading live tracking details...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                color: 'var(--danger)',
                borderRadius: '14px',
                fontSize: '13.5px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Order Details */}
          {!isLoading && order && (
            <div
              style={{
                backgroundColor: 'var(--bg-deep)',
                borderRadius: '18px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              {/* Colored stripe */}
              <div
                style={{
                  height: '3px',
                  backgroundColor:
                    order.status === 'Completed'
                      ? '#4ADE80'
                      : order.status === 'Cancelled'
                      ? '#F87171'
                      : order.status === 'Out for Delivery'
                      ? '#A855F7'
                      : '#F59E0B',
                }}
              />

              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Order header row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Receipt size={15} color="var(--accent)" />
                    <span
                      style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}
                    >
                      {order.orderId}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      ·{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      backgroundColor:
                        order.status === 'Completed'
                          ? 'rgba(74,222,128,0.12)'
                          : order.status === 'Cancelled'
                          ? 'rgba(248,113,113,0.12)'
                          : order.status === 'Out for Delivery'
                          ? 'rgba(168,85,247,0.12)'
                          : 'rgba(251,191,36,0.12)',
                      color:
                        order.status === 'Completed'
                          ? '#4ADE80'
                          : order.status === 'Cancelled'
                          ? '#F87171'
                          : order.status === 'Out for Delivery'
                          ? '#A855F7'
                          : '#FBBF24',
                      border: `1px solid ${
                        order.status === 'Completed'
                          ? 'rgba(74,222,128,0.3)'
                          : order.status === 'Cancelled'
                          ? 'rgba(248,113,113,0.3)'
                          : order.status === 'Out for Delivery'
                          ? 'rgba(168,85,247,0.3)'
                          : 'rgba(251,191,36,0.3)'
                      }`,
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Cancelled state */}
                {order.status === 'Cancelled' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      backgroundColor: 'rgba(248,113,113,0.1)',
                      border: '1px solid rgba(248,113,113,0.3)',
                      borderRadius: '12px',
                      color: '#F87171',
                    }}
                  >
                    <XCircle size={20} />
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '14px' }}>Order Cancelled</p>
                      <p style={{ fontSize: '12.5px', opacity: 0.85 }}>This order has been cancelled.</p>
                    </div>
                  </div>
                ) : (
                  /* Progress timeline */
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '6px',
                      position: 'relative',
                      paddingTop: '6px',
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
                          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              backgroundColor: isCompleted ? 'var(--accent)' : 'var(--bg-surface)',
                              color: isCompleted ? 'var(--bg-deep)' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '8px',
                              border: isCurrent ? '3px solid rgba(212,165,116,0.6)' : '1px solid var(--border)',
                              boxShadow: isCompleted ? '0 4px 14px rgba(212,165,116,0.35)' : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <IconComponent size={18} />
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: isCompleted ? '700' : '500',
                              color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                              lineHeight: 1.3,
                            }}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Delivery info */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '13px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      color: 'var(--accent)',
                    }}
                  >
                    Delivery Details
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{order.shippingAddress || 'Delivery Address Provided'}</span>
                  </div>
                  {order.paymentPhone && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Phone</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{order.paymentPhone}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Payment Method</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                      {order.paymentMethod === 'evc_plus'
                        ? 'EVC Plus (Hormuud)'
                        : order.paymentMethod === 'edahab'
                        ? 'eDahab (Dahabshiil)'
                        : 'Pay on Delivery (Mobile Money)'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      padding: '14px 16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        color: 'var(--accent)',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      Items Ordered ({order.items.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {order.items.map((it: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {typeof it.food === 'object' && it.food?.image && (
                              <img
                                src={it.food.image}
                                alt={it.name || 'Dish'}
                                style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                            )}
                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                              {it.quantity}× {typeof it.food === 'object' ? it.food.name : it.name || 'Dish'}
                            </span>
                          </div>
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        borderTop: '1px solid var(--border)',
                        paddingTop: '10px',
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: '800',
                        fontSize: '15px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Total Amount</span>
                      <span style={{ color: 'var(--accent)', fontSize: '17px' }}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
