'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { DashboardStats, RevenueChartItem, TopFoodItem } from '@/types';
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  Users,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartItem[]>([]);
  const [topFoods, setTopFoods] = useState<TopFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, revenueRes, topFoodsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/revenue-chart'),
        api.get('/dashboard/top-foods'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (revenueRes.data.success) setRevenueData(revenueRes.data.data);
      if (topFoodsRes.data.success) setTopFoods(topFoodsRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Restaurant overview
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: '700', marginTop: '5px', color: 'var(--text-primary)' }}>
            {getGreeting()}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '5px' }}>
            A quick view of today&apos;s sales, orders, and menu activity.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <span>System active</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Card 1: Sales */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            padding: '18px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '9px',
              backgroundColor: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.25)',
              color: '#4ADE80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Completed Revenue
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>
              ${stats?.totalSales?.toFixed(2) || '0.00'}
            </h2>
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            padding: '18px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '9px',
              backgroundColor: 'rgba(212, 165, 116, 0.12)',
              border: '1px solid rgba(212, 165, 116, 0.25)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Active Orders
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>
              {stats?.activeOrders || 0}
            </h2>
          </div>
        </div>

        {/* Card 3: Menu Items */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            padding: '18px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '9px',
              backgroundColor: 'rgba(96, 165, 250, 0.12)',
              border: '1px solid rgba(96, 165, 250, 0.25)',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Utensils size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Active Dishes
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>
              {stats?.totalItems || 0}
            </h2>
          </div>
        </div>

        {/* Card 4: Customers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            padding: '18px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '9px',
              backgroundColor: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              color: '#FBBF24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Total Customers
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>
              {stats?.totalCustomers || 0}
            </h2>
          </div>
        </div>

        {/* Card 5: Completed Orders */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            padding: '18px',
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '9px', backgroundColor: 'rgba(74, 222, 128, 0.12)', border: '1px solid rgba(74, 222, 128, 0.25)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Completed Orders</span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>{stats?.completedOrders || 0}</h2>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Top Selling Foods */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Revenue Analytics Chart */}
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                7-Day Revenue Trends
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Real-time sales performance over the past week
              </p>
            </div>
            <TrendingUp size={20} color="var(--accent)" />
          </div>

          <div style={{ width: '100%', height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A574" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4A574" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 165, 116, 0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4A574" strokeWidth={3} fillOpacity={1} fill="url(#revenueColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Foods Chart */}
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
            Top Selling Dishes
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Most ordered dishes by quantity
          </p>
          {topFoods.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No sales data recorded yet.</p>
          ) : (
            <div style={{ width: '100%', height: '270px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoods} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={125} stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--accent-muted)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    formatter={(value) => [value, 'Items sold']}
                  />
                  <Bar dataKey="totalOrdered" name="Items sold" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div
        style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '10px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Recent Orders
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Live stream of incoming dining orders</p>
          </div>
          <Link
            href="/admin/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            <span>View All Orders</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px' }}>
                <th style={{ padding: '12px 16px' }}>ORDER ID</th>
                <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '12px 16px' }}>TOTAL</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No recent orders.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent)' }}>
                      {ord.orderId}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {typeof ord.user === 'object' ? ord.user.name : 'Customer'}
                      </p>
                      {typeof ord.user === 'object' && ord.user.phone && (
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {ord.user.phone}
                        </p>
                      )}
                      {typeof ord.user === 'object' && ord.user.email && (
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {ord.user.email}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          backgroundColor:
                            ord.status === 'Completed'
                              ? 'rgba(74, 222, 128, 0.12)'
                              : ord.status === 'Cancelled'
                              ? 'rgba(248, 113, 113, 0.12)'
                              : 'rgba(251, 191, 36, 0.12)',
                          color:
                            ord.status === 'Completed'
                              ? '#4ADE80'
                              : ord.status === 'Cancelled'
                              ? '#F87171'
                              : '#FBBF24',
                          border: `1px solid ${
                            ord.status === 'Completed'
                              ? 'rgba(74, 222, 128, 0.3)'
                              : ord.status === 'Cancelled'
                              ? 'rgba(248, 113, 113, 0.3)'
                              : 'rgba(251, 191, 36, 0.3)'
                          }`,
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-deep)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
