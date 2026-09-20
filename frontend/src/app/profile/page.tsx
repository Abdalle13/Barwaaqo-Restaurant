'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { User, Phone, MapPin, Lock, CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateUser, token } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Orders
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }

    if (token) {
      api.get('/orders/my-orders')
        .then((res) => {
          if (res.data.success) {
            setMyOrders(res.data.data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user, token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess('');

    try {
      const res = await api.put('/auth/profile', { name, phone, address });
      if (res.data.success) {
        updateUser(res.data.data);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px' }}>
          <div
            style={{
              textAlign: 'center',
              padding: '50px 30px',
              maxWidth: '440px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
            }}
          >
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Please sign in to view your profile and orders.</p>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                padding: '12px 28px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-deep)',
                fontWeight: '700',
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '120px 0 90px 0' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Customer Dashboard
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                marginBottom: '8px',
              }}
            >
              Account & Profile
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Manage your personal information, security settings, and past dining orders.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Profile Info Form */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '30px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '19px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                <User size={20} color="var(--accent)" />
                <span>Personal Information</span>
              </h3>

              {profileSuccess && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(74, 222, 128, 0.12)',
                    color: '#4ADE80',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '18px',
                  }}
                >
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="form-input"
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      opacity: 0.6,
                      cursor: 'not-allowed',
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="form-input"
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <label className="form-label">Default Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '14px',
                    border: 'none',
                    cursor: isUpdatingProfile ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 18px rgba(212, 165, 116, 0.3)',
                  }}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Right: Security & Password */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '30px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '19px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                <Lock size={20} color="var(--accent)" />
                <span>Change Password</span>
              </h3>

              {passwordSuccess && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(74, 222, 128, 0.12)',
                    color: '#4ADE80',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '18px',
                  }}
                >
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(248, 113, 113, 0.12)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '18px',
                  }}
                >
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="form-input"
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <label className="form-label">New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="form-input"
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-deep)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: isUpdatingPassword ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div style={{ marginTop: '56px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-primary)',
              }}
            >
              <Package size={22} color="var(--accent)" />
              <span>My Recent Orders</span>
            </h3>

            {isLoadingOrders ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading order history...</p>
            ) : myOrders.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You have not placed any orders yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {myOrders.map((ord) => (
                  <div
                    key={ord._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)', marginTop: '2px' }}>
                        {ord.orderId}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {ord.items.length} dishes • Total: ${ord.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
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

                      <Link
                        href={`/track?orderId=${ord.orderId}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-deep)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontWeight: '600',
                          fontSize: '13px',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Track</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
