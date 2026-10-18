'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  DollarSign, ShoppingBag, TrendingUp, Users, Star,
  BarChart3, RefreshCw, Calendar, Award, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useSettings } from '@/context/SettingsContext';
import { Download } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalFoods: number;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  completedOrders: number;
}

interface ChartItem { date: string; revenue: number; orders: number; }
interface TopFood { name: string; totalOrders: number; totalRevenue: number; image?: string; }

const PIE_COLORS = ['#4ADE80', '#FBBF24', '#60A5FA', '#F87171', '#A78BFA'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--text-primary)',
      }}>
        <p style={{ fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' && p.name?.includes('Revenue') ? `$${p.value.toFixed(2)}` : p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminReportsPage() {
  const { settings } = useSettings();
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenueData, setRevenueData] = useState<ChartItem[]>([]);
  const [topFoods, setTopFoods] = useState<TopFood[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, revenueRes, topFoodsRes, ordersRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/revenue-chart'),
        api.get('/dashboard/top-foods'),
        api.get('/orders?limit=200'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (revenueRes.data.success) setRevenueData(revenueRes.data.data);
      if (topFoodsRes.data.success) setTopFoods(topFoodsRes.data.data);

      if (ordersRes.data.success) {
        const orders: any[] = ordersRes.data.data;
        const statusCount: Record<string, number> = {};
        orders.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
        setOrderStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: `${settings.currencySymbol}${stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: '#4ADE80', sub: `${settings.currencySymbol}${stats.revenueToday?.toFixed(2) || '0.00'} today` },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag, color: '#60A5FA', sub: `${stats.ordersToday || 0} today` },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: Clock, color: '#FBBF24', sub: `${stats.completedOrders || 0} completed` },
    { label: 'Registered Users', value: stats.totalUsers || 0, icon: Users, color: '#A78BFA', sub: 'Total customers' },
  ] : [];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '16px', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p>Loading reports...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <BarChart3 size={22} color="var(--accent)" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Analytics & Reports
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Revenue trends, order breakdown, and top-performing dishes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              borderRadius: '10px', border: '1px solid var(--accent)', backgroundColor: 'rgba(212, 165, 116, 0.1)',
              color: 'var(--accent)', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Download size={14} /> Download PDF
          </button>
          {lastUpdated && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} style={{
            backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)',
            padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <TrendingUp size={14} color="var(--text-muted)" />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {value}
              </p>
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="var(--accent)" /> Revenue Over Time
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A574" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#D4A574" fill="url(#revGrad)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Orders Chart + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {revenueData.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} color="var(--accent)" /> Daily Orders
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="Orders" fill="#60A5FA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {orderStatusData.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} color="var(--accent)" /> Order Status Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {orderStatusData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Foods */}
      {topFoods.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-elevated)' }}>
            <Award size={16} color="var(--accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Top Selling Dishes
            </h3>
          </div>
          <div>
            {topFoods.slice(0, 8).map((food, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 22px', borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s',
              }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '13px', fontWeight: '800',
                  backgroundColor: idx < 3 ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                  color: idx < 3 ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0,
                }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {food.name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {food.totalOrders} orders
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--accent)' }}>
                    {settings.currencySymbol}{food.totalRevenue?.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>revenue</p>
                </div>
                {idx < 3 && <Star size={14} fill="var(--accent)" color="var(--accent)" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
