'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrackOrderModal from '@/components/TrackOrderModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import { Order } from '@/types';
import {
  ShoppingBag,
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  ArrowRight,
  RefreshCw,
  Search,
  Receipt,
  UtensilsCrossed,
  RotateCcw,
} from 'lucide-react';

export default function MyOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reorderedId, setReorderedId] = useState<string | null>(null);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<Order | null>(null);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  const fetchMyOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : err instanceof Error ? err.message : 'Failed to load your orders';
      setError(msg || 'Failed to load your orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading, fetchMyOrders]);

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      const foodItem = typeof item.food === 'object' && item.food !== null
        ? item.food
        : { _id: item.food as string, name: item.name || 'Food Item', price: item.price };

      addToCart(foodItem as any, item.quantity);
      count += item.quantity;
    });

    setReorderedId(order._id);
    setTimeout(() => setReorderedId(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          label: 'Order Received',
          icon: Clock,
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'Processing':
        return {
          label: 'Kitchen Preparing',
          icon: ChefHat,
          color: '#38BDF8',
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.3)',
        };
      case 'Out for Delivery':
        return {
          label: 'On the Way',
          icon: Truck,
          color: '#A855F7',
          bg: 'rgba(168, 85, 247, 0.12)',
          border: 'rgba(168, 85, 247, 0.3)',
        };
      case 'Completed':
        return {
          label: 'Delivered',
          icon: CheckCircle2,
          color: '#4ADE80',
          bg: 'rgba(74, 222, 128, 0.12)',
          border: 'rgba(74, 222, 128, 0.3)',
        };
      case 'Cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          color: '#F87171',
          bg: 'rgba(248, 113, 113, 0.12)',
          border: 'rgba(248, 113, 113, 0.3)',
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: 'var(--text-secondary)',
          bg: 'var(--bg-muted)',
          border: 'var(--border)',
        };
    }
  };

  // Order stats calculations
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => ['Pending', 'Processing', 'Out for Delivery'].includes(o.status)).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const totalSpent = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter === 'ACTIVE') {
      if (!['Pending', 'Processing', 'Out for Delivery'].includes(order.status)) return false;
    } else if (statusFilter === 'COMPLETED') {
      if (order.status !== 'Completed') return false;
    } else if (statusFilter === 'CANCELLED') {
      if (order.status !== 'Cancelled') return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesId = order.orderId?.toLowerCase().includes(q);
      const matchesAddress = order.shippingAddress?.toLowerCase().includes(q);
      const matchesItems = order.items.some((it) => {
        const foodName = (typeof it.food === 'object' && it.food?.name) || it.name || '';
        return foodName.toLowerCase().includes(q);
      });
      return matchesId || matchesAddress || matchesItems;
    }

    return true;
  });

  // Not logged in view
  if (!authLoading && !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 20px 90px' }}>
          <div
            style={{
              textAlign: 'center',
              padding: '48px 36px',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-muted)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <ShoppingBag size={30} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '10px',
              }}
            >
              View Your Orders
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '28px', lineHeight: 1.6 }}>
              Please sign in to view all your personal dining orders and live order tracking.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(182, 83, 58, 0.3)',
                }}
              >
                <span>Sign In</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Register
              </Link>
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
          {/* Header section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '6px',
                  display: 'block',
                }}
              >
                Customer Account
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.5px',
                  marginBottom: '4px',
                }}
              >
                My Orders
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Track and manage all your dining orders in one place.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={fetchMyOrders}
                disabled={isLoading}
                title="Refresh Orders"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
                <span>Refresh</span>
              </button>

              <Link
                href="/menu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <UtensilsCrossed size={14} />
                <span>Order Food</span>
              </Link>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              padding: '14px 18px',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            {/* Status pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'ALL', label: 'All Orders', count: totalOrdersCount },
                { key: 'ACTIVE', label: 'Active', count: activeOrdersCount },
                { key: 'COMPLETED', label: 'Delivered', count: completedOrdersCount },
                { key: 'CANCELLED', label: 'Cancelled', count: orders.filter((o) => o.status === 'Cancelled').length },
              ].map((tab) => {
                const isActive = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key as any)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : 'var(--bg-deep)',
                        color: isActive ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '6px 12px',
                minWidth: '220px',
                flexGrow: 1,
                maxWidth: '360px',
              }}
            >
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by Order ID or dish name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '2px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Feedback & Error */}
          {error && (
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: 'rgba(248, 113, 113, 0.12)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                color: 'var(--danger)',
                borderRadius: '14px',
                marginBottom: '24px',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '180px',
                    borderRadius: '18px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    opacity: 0.6,
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              ))}
            </div>
          )}

          {/* Orders List */}
          {!isLoading && filteredOrders.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order._id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '18px',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    {/* Colored top stripe by status */}
                    <div style={{ height: '3px', backgroundColor: badge.color, opacity: 0.8 }} />

                    {/* Card Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-deep)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Order ID */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: '700',
                            fontSize: '13.5px',
                            color: 'var(--accent)',
                          }}
                        >
                          <Receipt size={14} />
                          <span>{order.orderId}</span>
                        </div>

                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--text-muted)',
                            display: 'inline-block',
                          }}
                        />

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {formattedDate}
                        </span>
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 12px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          <BadgeIcon size={13} />
                          <span>{badge.label}</span>
                        </span>

                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            backgroundColor: order.paymentStatus === 'Paid' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: order.paymentStatus === 'Paid' ? '#4ADE80' : '#F59E0B',
                            border: `1px solid ${order.paymentStatus === 'Paid' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          }}
                        >
                          {order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div
                      style={{
                        padding: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '20px',
                        alignItems: 'start',
                      }}
                    >
                      {/* Left section: items + delivery info */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Items */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                          }}
                        >
                          {order.items.map((item, idx) => {
                            const foodObj = typeof item.food === 'object' && item.food !== null ? item.food : null;
                            const foodName = foodObj?.name || item.name || 'Dish Item';
                            const foodImage = foodObj?.image;

                            return (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px 8px 8px',
                                  borderRadius: '12px',
                                  backgroundColor: 'var(--bg-deep)',
                                  border: '1px solid var(--border)',
                                  flexShrink: 0,
                                }}
                              >
                                {foodImage ? (
                                  <Image
                                    src={foodImage}
                                    alt={foodName}
                                    width={40}
                                    height={40}
                                    unoptimized
                                    loader={({ src }) => src}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '8px',
                                      objectFit: 'cover',
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '8px',
                                      backgroundColor: 'var(--accent-muted)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'var(--accent)',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <UtensilsCrossed size={18} />
                                  </div>
                                )}
                                <div>
                                  <p style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                    {foodName}
                                  </p>
                                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                    ×{item.quantity} &nbsp;·&nbsp; ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Delivery & payment meta */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px' }}>
                          {order.shippingAddress && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                              <MapPin size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: '1px' }} />
                              <span style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={14} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span style={{ color: 'var(--text-secondary)' }}>{order.paymentPhone}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                              {order.paymentMethod === 'evc_plus' ? 'EVC Plus' : 'Cash on Delivery'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right section: totals + actions */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          minWidth: '180px',
                          alignItems: 'flex-end',
                        }}
                      >
                        {/* Total */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                            Total
                          </span>
                          <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent)' }}>
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {order.items.reduce((a, i) => a + i.quantity, 0)} item{order.items.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                          <button
                            onClick={() => {
                              setSelectedTrackOrder(order);
                              setTrackModalOpen(true);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '9px 16px',
                              borderRadius: '10px',
                              backgroundColor: 'var(--accent)',
                              color: 'var(--bg-deep)',
                              fontWeight: '700',
                              fontSize: '13px',
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: 'var(--shadow-glow)',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap',
                              width: '100%',
                            }}
                          >
                            <Truck size={13} />
                            <span>Track Order</span>
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                              fontWeight: '600',
                              fontSize: '12.5px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <RotateCcw size={13} />
                            <span>{reorderedId === order._id ? 'Added to Cart ✓' : 'Reorder'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredOrders.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-muted)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <UtensilsCrossed size={28} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No matching orders found'
                  : 'No orders yet'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try clearing your filters or search keywords to view all your orders.'
                  : "You haven't placed any orders yet. Browse our menu to get started!"}
              </p>
              <Link
                href="/menu"
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
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <span>Browse Menu</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => {
          setTrackModalOpen(false);
          setSelectedTrackOrder(null);
        }}
        order={selectedTrackOrder}
      />
    </div>
  );
}
