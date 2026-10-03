'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  DollarSign,
  ChevronDown,
  ChevronUp,
  CreditCard,
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
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

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
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
          ? err.message
          : 'Failed to load your orders';
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
    order.items.forEach((item) => {
      const foodItem =
        typeof item.food === 'object' && item.food !== null
          ? item.food
          : { _id: item.food as string, name: item.name || 'Food Item', price: item.price };

      addToCart(foodItem as any, item.quantity);
    });

    setReorderedId(order._id);
    setTimeout(() => setReorderedId(null), 2500);
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
          label: 'In Kitchen',
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
  const totalSpent = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
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
  }, [orders, statusFilter, searchQuery]);

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
              Please sign in to view your complete dining history and real-time live order tracking.
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

      <main style={{ flexGrow: 1, padding: 'clamp(95px, 14vw, 130px) 0 70px' }}>
        <div className="container">
          {/* Header section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px',
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
                  marginBottom: '4px',
                  display: 'block',
                }}
              >
                Personal Dashboard
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 38px)',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.5px',
                  marginBottom: '6px',
                }}
              >
                My Orders
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', margin: 0 }}>
                Track your active deliveries and review previous culinary orders.
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

          {/* Metric Overview Cards */}
          <div className="orders-stats-grid">
            <div className="orders-stat-card">
              <div
                className="orders-stat-icon"
                style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
              >
                <ShoppingBag size={22} />
              </div>
              <div className="orders-stat-info">
                <span className="orders-stat-label">Total Orders</span>
                <span className="orders-stat-value">{totalOrdersCount}</span>
              </div>
            </div>

            <div className="orders-stat-card">
              <div
                className="orders-stat-icon"
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8' }}
              >
                <ChefHat size={22} />
              </div>
              <div className="orders-stat-info">
                <span className="orders-stat-label">In Progress</span>
                <span className="orders-stat-value" style={{ color: activeOrdersCount > 0 ? '#38BDF8' : undefined }}>
                  {activeOrdersCount}
                </span>
              </div>
            </div>

            <div className="orders-stat-card">
              <div
                className="orders-stat-icon"
                style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)', color: '#4ADE80' }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div className="orders-stat-info">
                <span className="orders-stat-label">Delivered</span>
                <span className="orders-stat-value">{completedOrdersCount}</span>
              </div>
            </div>

            <div className="orders-stat-card">
              <div
                className="orders-stat-icon"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}
              >
                <DollarSign size={22} />
              </div>
              <div className="orders-stat-info">
                <span className="orders-stat-label">Total Spent</span>
                <span className="orders-stat-value">${totalSpent.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="orders-filter-bar">
            {/* Status Tabs */}
            <div className="orders-tabs">
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
                    className="orders-tab-btn"
                    style={{
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        backgroundColor: isActive ? 'rgba(0, 0, 0, 0.2)' : 'var(--bg-deep)',
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
            <div className="orders-search-box">
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by Order ID or dish name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    padding: '2px 4px',
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '210px',
                    borderRadius: '20px',
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
            <div>
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

                const isExpanded = !!expandedOrders[order._id];
                const totalItemCount = order.items.reduce((acc, it) => acc + (it.quantity || 1), 0);
                const displayedItems = isExpanded ? order.items : order.items.slice(0, 3);
                const hiddenCount = order.items.length - 3;

                return (
                  <div key={order._id} className="orders-card">
                    {/* Top colored status stripe */}
                    <div className="orders-card-top-stripe" style={{ backgroundColor: badge.color }} />

                    {/* Card Header */}
                    <div className="orders-card-header">
                      <div className="orders-card-meta-left">
                        <div className="orders-id-badge">
                          <Receipt size={15} />
                          <span>{order.orderId || `#${order._id.slice(-6).toUpperCase()}`}</span>
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

                      <div className="orders-card-meta-right">
                        {/* Status badge */}
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

                        {/* Payment badge */}
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            backgroundColor:
                              order.paymentStatus === 'Paid'
                                ? 'rgba(74, 222, 128, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                            color: order.paymentStatus === 'Paid' ? '#4ADE80' : '#F59E0B',
                            border: `1px solid ${
                              order.paymentStatus === 'Paid'
                                ? 'rgba(74, 222, 128, 0.3)'
                                : 'rgba(245, 158, 11, 0.3)'
                            }`,
                          }}
                        >
                          {order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="orders-card-body">
                      {/* Dishes / Items list */}
                      <div className="orders-items-list">
                        {displayedItems.map((item, idx) => {
                          const foodObj = typeof item.food === 'object' && item.food !== null ? item.food : null;
                          const foodName = foodObj?.name || item.name || 'Dish Item';
                          const foodImage = foodObj?.image;
                          const itemPrice = Number(item.price) || 0;
                          const itemQty = Number(item.quantity) || 1;
                          const lineTotal = itemPrice * itemQty;

                          return (
                            <div key={idx} className="orders-item-row">
                              <div className="orders-item-left">
                                {foodImage ? (
                                  <Image
                                    src={foodImage}
                                    alt={foodName}
                                    width={44}
                                    height={44}
                                    unoptimized
                                    loader={({ src }) => src}
                                    className="orders-item-image"
                                  />
                                ) : (
                                  <div className="orders-item-fallback-icon">
                                    <UtensilsCrossed size={18} />
                                  </div>
                                )}

                                <div className="orders-item-details">
                                  <span className="orders-item-name">{foodName}</span>
                                  <span className="orders-item-sub">
                                    Qty: <strong>{itemQty}</strong> &nbsp;·&nbsp; ${itemPrice.toFixed(2)} each
                                  </span>
                                </div>
                              </div>

                              <div className="orders-item-price">
                                ${lineTotal.toFixed(2)}
                              </div>
                            </div>
                          );
                        })}

                        {/* Expand/Collapse Toggle if more than 3 items */}
                        {order.items.length > 3 && (
                          <button
                            onClick={() => toggleExpand(order._id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              background: 'transparent',
                              border: '1px dashed var(--border)',
                              borderRadius: '10px',
                              color: 'var(--accent)',
                              fontSize: '12.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              marginTop: '2px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {isExpanded ? (
                              <>
                                <span>Show fewer dishes</span>
                                <ChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                <span>+ View {hiddenCount} more dishes</span>
                                <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Meta Details Strip: Address, Phone, Payment */}
                      <div className="orders-meta-strip">
                        {order.shippingAddress && (
                          <div className="orders-meta-item">
                            <MapPin size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span>{order.shippingAddress}</span>
                          </div>
                        )}

                        {order.paymentPhone && (
                          <div className="orders-meta-item">
                            <Phone size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span>{order.paymentPhone}</span>
                          </div>
                        )}

                        <div className="orders-meta-item">
                          <CreditCard size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                          <span>
                            Method:{' '}
                            <strong>
                              {order.paymentMethod === 'evc_plus'
                                ? 'EVC Plus (Hormuud)'
                                : order.paymentMethod === 'edahab'
                                ? 'eDahab (Dahabshiil)'
                                : 'Pay on Delivery'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Total & Actions */}
                    <div className="orders-card-footer">
                      <div className="orders-total-col">
                        <span className="orders-total-label">Total Amount</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span className="orders-total-val">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                          </span>
                        </div>
                      </div>

                      <div className="orders-actions-btns">
                        {/* Active Orders: Show ONLY Track Order */}
                        {['Pending', 'Processing', 'Out for Delivery'].includes(order.status) && (
                          <button
                            onClick={() => {
                              setSelectedTrackOrder(order);
                              setTrackModalOpen(true);
                            }}
                            className="orders-track-btn"
                            title="Track delivery status"
                          >
                            <Truck size={15} />
                            <span>Track Order</span>
                          </button>
                        )}

                        {/* Completed / Delivered Orders: Show ONLY Reorder */}
                        {(order.status === 'Completed' || order.status === 'Cancelled') && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="orders-track-btn"
                            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-deep)' }}
                            title="Add items to cart"
                          >
                            <RotateCcw size={14} />
                            <span>{reorderedId === order._id ? 'Added ✓' : 'Reorder'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredOrders.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                maxWidth: '540px',
                margin: '20px auto 0',
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
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No matching orders found'
                  : 'No orders yet'}
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14.5px',
                  marginBottom: '26px',
                  lineHeight: 1.6,
                }}
              >
                {searchQuery || statusFilter !== 'ALL'
                  ? 'We could not find any orders matching your selected filters. Try changing or clearing your search.'
                  : "You haven't placed any dining orders yet. Explore our delicious authentic menu and place your first order!"}
              </p>
              {searchQuery || statusFilter !== 'ALL' ? (
                <button
                  onClick={() => {
                    setStatusFilter('ALL');
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 26px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Reset Filters</span>
                </button>
              ) : (
                <Link
                  href="/menu"
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
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span>Explore Menu</span>
                  <ArrowRight size={16} />
                </Link>
              )}
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
