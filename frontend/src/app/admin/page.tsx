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
  ArrowUpRight,
  Clock,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
            Barwaaqo Restaurant Operations
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px' }}>
            Executive Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/orders" className="btn btn-primary btn-sm">
            <ShoppingBag size={15} />
            <span>Manage Orders</span>
          </Link>
          <Link href="/admin/menu/new" className="btn btn-secondary btn-sm">
            <Utensils size={15} />
            <span>Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1: Sales */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Completed Revenue
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px' }}>
              ${stats?.totalSales?.toFixed(2) || '0.00'}
            </h2>
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Active Orders
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px' }}>
              {stats?.activeOrders || 0}
            </h2>
          </div>
        </div>

        {/* Card 3: Menu Items */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--info-light)',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Utensils size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Active Dishes
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px' }}>
              {stats?.totalItems || 0}
            </h2>
          </div>
        </div>

        {/* Card 4: Customers */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Total Users
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginTop: '2px' }}>
              {stats?.totalCustomers || 0}
            </h2>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Top Selling Foods */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Revenue Analytics Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                7-Day Revenue Trends
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Real-time sales performance over the past week
              </p>
            </div>
            <TrendingUp size={20} color="var(--primary)" />
          </div>

          <div style={{ width: '100%', height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#revenueColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Foods List */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>
            Top Selling Dishes
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Highest demand customer favorites
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topFoods.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No sales data recorded yet.</p>
            ) : (
              topFoods.map((dish, idx) => (
                <div
                  key={dish._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: idx !== topFoods.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: idx === 0 ? 'var(--primary)' : 'var(--bg-muted)',
                        color: idx === 0 ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{dish.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {dish.totalOrdered} orders fulfilled
                      </p>
                    </div>
                  </div>

                  <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--primary)' }}>
                    ${dish.totalRevenue?.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Recent Orders</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Live stream of incoming dining orders</p>
          </div>
          <Link href="/admin/orders" className="btn btn-secondary btn-sm">
            <span>View All Orders</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px' }}>
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
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No recent orders.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--primary)' }}>
                      {ord.orderId}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {typeof ord.user === 'object' ? ord.user.name : 'Customer'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '800' }}>
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        className={`badge ${
                          ord.status === 'Completed'
                            ? 'badge-success'
                            : ord.status === 'Cancelled'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-surface)',
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
