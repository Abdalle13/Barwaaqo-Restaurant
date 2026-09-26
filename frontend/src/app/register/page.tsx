'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { ArrowLeft, UserPlus, User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', {
        name,
        email: email.trim().toLowerCase(),
        phone,
        address,
        password,
      });

      if (res.data.success) {
        const { token, ...userData } = res.data.data;
        login(token, userData);
        router.push('/menu');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <header style={{ height: '72px', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
        <div style={{ width: '100%', maxWidth: '1180px', height: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '700', color: 'var(--accent)', textDecoration: 'none' }}>
            Barwaaqo Restaurant
          </Link>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>
      </header>

      <main style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: 'clamp(32px, 6vh, 64px) 20px 56px' }}>
        <div style={{ padding: '42px 36px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '58px', height: '58px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)', color: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto', boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)' }}>
                <UserPlus size={26} strokeWidth={2.2} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '30px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Join Barwaaqo
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Create an account to reserve tables, order dishes, and track deliveries.
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(248, 113, 113, 0.12)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  color: 'var(--danger)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '22px',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={17}
                    color="var(--accent)"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}
                  />
                  <input
                    type="text"
                    placeholder="Fatima Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                    style={{
                      paddingLeft: '48px',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '7px',
                      height: '46px',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={17}
                    color="var(--accent)"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}
                  />
                  <input
                    type="email"
                    placeholder="fatima@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    style={{
                      paddingLeft: '48px',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '7px',
                      height: '46px',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                  Phone Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={17}
                    color="var(--accent)"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}
                  />
                  <input
                    type="text"
                    placeholder="+252 61 0000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="form-input"
                    style={{
                      paddingLeft: '48px',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '7px',
                      height: '46px',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                  Default Delivery Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={17}
                    color="var(--accent)"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}
                  />
                  <input
                    type="text"
                    placeholder="KM4, Waberi, Mogadishu"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    style={{
                      paddingLeft: '48px',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '7px',
                      height: '46px',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '26px' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                  Password * (Minimum 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={17}
                    color="var(--accent)"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="form-input"
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '48px',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '7px',
                      height: '46px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  borderRadius: '7px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div
              style={{
                textAlign: 'center',
                marginTop: '26px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
              }}
            >
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>
          </div>
      </main>
    </div>
  );
}
