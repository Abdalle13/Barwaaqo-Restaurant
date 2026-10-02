'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { DashboardStats, RevenueChartItem } from '@/types';
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  Users,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, revenueRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/revenue-chart'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (revenueRes.data.success) setRevenueData(revenueRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Admin';
    if (hour < 18) return 'Good Afternoon, Admin';
    return 'Good Evening, Admin';
  };

  // Order distribution channels for the circle chart (unified brand-aligned palette)
  const totalOrdersCount = (stats?.completedOrders || 0) + (stats?.activeOrders || 0) || 1;
  const channelData = [
    {
      name: 'Dine-In Orders',
      value: Math.max(stats?.completedOrders || 0, 1),
      color: '#E08A65', // Brand Warm Accent
    },
    {
      name: 'Active In Kitchen',
      value: Math.max(stats?.activeOrders || 0, 1),
      color: '#D4A373', // Warm Gold/Amber
    },
    {
      name: 'Takeaway / Other',
      value: Math.max(stats?.newOrders || 0, 1),
      color: '#525252', // Sophisticated Slate Neutral
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '1.4px',
            }}
          >
            Restaurant Management Portal
          </span>
          <h1
            style={{
              fontSize: 'clamp(24px, 3vw, 28px)',
              fontWeight: '700',
              marginTop: '4px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.4px',
            }}
          >
            {getGreeting()}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Real-time financial summary, active orders, and restaurant performance.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => fetchDashboardData()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '9px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
            title="Sync data"
          >
            <RefreshCw size={13} className={isLoading ? 'spin-animation' : ''} />
            <span>Sync</span>
          </button>

          <Link
            href="/admin/pos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '9px',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverse)',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 2px 10px var(--accent-glow)',
              transition: 'var(--transition-fast)',
            }}
          >
            <ShoppingBag size={14} />
            <span>POS Terminal</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row — 5 Cohesive Cards (Unified Brand Styling, Real Data) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Card 1: Gross Revenue */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Gross Revenue
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.3px' }}>
              ${stats?.totalSales !== undefined ? stats.totalSales.toFixed(2) : '0.00'}
            </h2>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Completed settlements
            </span>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign size={20} />
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Active Orders
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.3px' }}>
              {stats?.activeOrders ?? 0}
            </h2>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              In kitchen & delivery
            </span>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Card 3: Active Dishes */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Active Dishes
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.3px' }}>
              {stats?.totalItems ?? 0}
            </h2>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Live on customer menu
            </span>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Utensils size={20} />
          </div>
        </div>

        {/* Card 4: Registered Customers */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Total Customers
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.3px' }}>
              {stats?.totalCustomers ?? 0}
            </h2>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Registered diners
            </span>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={20} />
          </div>
        </div>

        {/* Card 5: Completed Orders */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Completed Orders
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.3px' }}>
              {stats?.completedOrders ?? 0}
            </h2>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Fulfilled orders
            </span>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Main Charts Section — 2 Columns (Real Revenue Trend + Order Distribution Donut) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px',
        }}
      >
        {/* Left Chart: 7-Day Revenue Trend (Span 7) */}
        <div
          style={{
            gridColumn: 'span 7',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
                7-Day Revenue Trends
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Real-time daily sales performance over the past week
              </p>
            </div>
            <TrendingUp size={18} color="var(--accent)" />
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E08A65" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#E08A65" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} dy={4} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    fontSize: '12.5px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E08A65"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueFill)"
                  dot={{ r: 3.5, fill: '#E08A65', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Order Distribution & Channels Circle/Donut Chart (Span 5) */}
        <div
          style={{
            gridColumn: 'span 5',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Order Distribution
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Breakdown across dining room, active orders, and takeaway
            </p>
          </div>

          {/* Donut Chart */}
          <div style={{ width: '100%', height: '200px', position: 'relative', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} orders`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Summary */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {stats?.totalOrders || stats?.completedOrders || stats?.activeOrders || 0}
              </span>
              <span style={{ display: 'block', fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Total Orders
              </span>
            </div>
          </div>

          {/* Clean Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {channelData.map((c) => (
              <div
                key={c.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-base)',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


