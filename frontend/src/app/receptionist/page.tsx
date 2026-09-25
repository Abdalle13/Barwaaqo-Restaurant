'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  CalendarCheck,
  TableProperties,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  RefreshCw,
  ConciergeBell,
  Sparkles,
} from 'lucide-react';

interface DashStats {
  pendingReservations: number;
  confirmedReservations: number;
  availableTables: number;
  occupiedTables: number;
  todayOrders: number;
  pendingOrders: number;
}

interface RecentReservation {
  _id: string;
  customerName: string;
  guests: number;
  reservationDate: string;
  reservationTime: string;
  status: string;
}

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashStats>({ pendingReservations: 0, confirmedReservations: 0, availableTables: 0, occupiedTables: 0, todayOrders: 0, pendingOrders: 0 });
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resRes, tableRes, orderRes] = await Promise.allSettled([
        api.get('/reservations'),
        api.get('/tables'),
        api.get('/orders'),
      ]);

      let newStats = { ...stats };

      if (resRes.status === 'fulfilled' && resRes.value.data.success) {
        const reservations: RecentReservation[] = resRes.value.data.data || [];
        newStats.pendingReservations = reservations.filter(r => r.status === 'Pending').length;
        newStats.confirmedReservations = reservations.filter(r => r.status === 'Confirmed').length;
        // Show today's + upcoming reservations
        const upcoming = reservations
          .filter(r => r.status !== 'Cancelled' && r.status !== 'Completed')
          .slice(0, 5);
        setRecentReservations(upcoming);
      }

      if (tableRes.status === 'fulfilled' && tableRes.value.data.success) {
        const tables = tableRes.value.data.data || [];
        newStats.availableTables = tables.filter((t: any) => t.status === 'Available').length;
        newStats.occupiedTables = tables.filter((t: any) => t.status !== 'Available').length;
      }

      if (orderRes.status === 'fulfilled' && orderRes.value.data.success) {
        const orders = orderRes.value.data.data || [];
        const today = new Date().toDateString();
        newStats.todayOrders = orders.filter((o: any) => new Date(o.createdAt).toDateString() === today).length;
        newStats.pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
      }

      setStats(newStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const STAT_CARDS = [
    { label: 'Pending Reservations', value: stats.pendingReservations, color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', icon: <Clock size={22} />, href: '/receptionist/reservations', urgent: stats.pendingReservations > 0 },
    { label: 'Confirmed Today', value: stats.confirmedReservations, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)', icon: <CalendarCheck size={22} />, href: '/receptionist/reservations' },
    { label: 'Available Tables', value: stats.availableTables, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', icon: <TableProperties size={22} />, href: '/receptionist/tables' },
    { label: 'Occupied / Reserved', value: stats.occupiedTables, color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: <Users size={22} />, href: '/receptionist/tables' },
    { label: 'Orders Today', value: stats.todayOrders, color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', icon: <ShoppingBag size={22} />, href: '/receptionist/orders' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'var(--accent)', bg: 'rgba(212,165,116,0.1)', border: 'rgba(212,165,116,0.2)', icon: <AlertCircle size={22} />, href: '/receptionist/orders', urgent: stats.pendingOrders > 0 },
  ];

  const timeString = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const getReservationStatusColor = (status: string) => {
    if (status === 'Pending') return '#FBBF24';
    if (status === 'Confirmed') return '#4ADE80';
    if (status === 'Cancelled') return '#F87171';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ConciergeBell size={16} color="#8B5CF6" />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              Receptionist Portal
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {dateString} · {timeString}
          </p>
        </div>
        <button
          onClick={fetchData}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {STAT_CARDS.map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: `1px solid ${card.urgent ? card.border : 'var(--border)'}`,
              borderRadius: '16px', padding: '20px',
              display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s',
              position: 'relative', overflow: 'hidden',
            }}>
              {card.urgent && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.color }} />
              )}
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {isLoading ? '—' : card.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{card.label}</div>
              </div>
              {card.urgent && card.value > 0 && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: card.color, animation: 'pulse 2s infinite', flexShrink: 0 }} />
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#8B5CF6" /> Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Manage Reservations', desc: 'View, confirm, or cancel bookings', href: '/receptionist/reservations', color: '#8B5CF6', icon: <CalendarCheck size={20} /> },
            { label: 'Table Status', desc: 'Update table availability & seating', href: '/receptionist/tables', color: '#60A5FA', icon: <TableProperties size={20} /> },
            { label: 'View Orders', desc: 'Monitor today\'s dine-in orders', href: '/receptionist/orders', color: '#4ADE80', icon: <ShoppingBag size={20} /> },
          ].map(action => (
            <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: '14px',
                cursor: 'pointer', transition: 'transform 0.15s',
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: `${action.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color, flexShrink: 0 }}>
                  {action.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{action.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{action.desc}</div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Reservations */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={16} color="#8B5CF6" /> Upcoming Reservations
          </h2>
          <Link href="/receptionist/reservations" style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: '#8B5CF6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
            Loading...
          </div>
        ) : recentReservations.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
            <CalendarCheck size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No upcoming reservations right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentReservations.map(res => (
              <div key={res._id} style={{
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={16} color="#8B5CF6" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{res.customerName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {res.guests} guests · {new Date(res.reservationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {res.reservationTime}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                  color: getReservationStatusColor(res.status),
                  backgroundColor: `${getReservationStatusColor(res.status)}15`,
                  border: `1px solid ${getReservationStatusColor(res.status)}30`,
                }}>
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
