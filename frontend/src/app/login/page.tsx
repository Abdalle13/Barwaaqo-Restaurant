'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { LogIn, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.success) {
        const { token, ...userData } = res.data.data;
        login(token, userData);

        if (userData.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/menu');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '60px 20px 90px 20px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
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
                <LogIn size={26} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
                Welcome Back
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Sign in to your Barwaaqo Restaurant account
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
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    placeholder="admin@barwaaqo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                {isLoading ? 'Signing in...' : 'Sign In'}
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
              Don't have an account?{' '}
              <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                Create Account
              </Link>
            </div>

            {/* Quick Demo Credentials Box */}
            <div
              style={{
                marginTop: '20px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-muted)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: '1.5',
              }}
            >
              <strong>Demo Logins:</strong>
              <br />
              Admin: <code>admin@barwaaqo.com</code> / <code>admin123456</code>
              <br />
              Customer: <code>customer@barwaaqo.com</code> / <code>customer123456</code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
