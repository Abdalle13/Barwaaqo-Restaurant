'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { User, Phone, MapPin, Lock, CheckCircle, Package } from 'lucide-react';
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '400px' }}>
            <p style={{ marginBottom: '16px' }}>Please sign in to view your profile and order history.</p>
            <Link href="/login" className="btn btn-primary" style={{ margin: '0 auto' }}>
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '40px 0 80px 0' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              Account & Profile
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              Manage your contact details, change password, and review recent dining orders.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px',
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Profile Info Form */}
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="var(--primary)" />
                <span>Personal Information</span>
              </h3>

              {profileSuccess && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="form-input"
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Default Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Right: Security & Password */}
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} color="var(--primary)" />
                <span>Change Password</span>
              </h3>

              {passwordSuccess && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--danger-light)',
                    color: 'var(--danger)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div style={{ marginTop: '50px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={24} color="var(--primary)" />
              <span>My Recent Orders</span>
            </h3>

            {isLoadingOrders ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading order history...</p>
            ) : myOrders.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>You have not placed any orders yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {myOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 24px',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                        {ord.orderId}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {ord.items.length} dishes • Total: ${ord.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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

                      <Link href={`/track?orderId=${ord.orderId}`} className="btn btn-secondary btn-sm">
                        Track
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
