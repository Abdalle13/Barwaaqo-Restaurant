'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UserPlus, User, Mail, Lock, Phone, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '50px 20px 80px 20px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="card" style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                }}
              >
                <UserPlus size={26} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
                Join Barwaaqo
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Create an account to order meals and track deliveries effortlessly
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="e.g. Fatima Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    placeholder="fatima@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="+252 61 0000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Delivery Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="KM4, Waberi, Mogadishu"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center' }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div
              style={{
                textAlign: 'center',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                fontSize: '14px',
                color: 'var(--text-muted)',
              }}
            >
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
