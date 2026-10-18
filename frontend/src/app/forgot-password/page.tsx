'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowLeft, Mail, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      if (res.data.success) {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Could not send reset link. Please verify your email and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ height: '72px', borderBottom: '1px solid var(--border)', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '1180px', height: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '700', color: 'var(--accent)', textDecoration: 'none' }}>
            Barwaaqo Restaurant
          </Link>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to login
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: ' clamp(28px, 6vw, 44px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          }}
        >
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(74, 222, 128, 0.12)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <CheckCircle2 size={32} color="#4ADE80" />
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Reset Link Sent!
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '26px',
                }}
              >
                We have sent instructions to{' '}
                <strong style={{ color: 'var(--accent)' }}>{email}</strong>. Please check your inbox and spam folder. The link is valid for 30 minutes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '13px 20px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(212, 165, 116, 0.35)',
                  }}
                >
                  Return to Login
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: '8px',
                    textDecoration: 'underline',
                  }}
                >
                  Did not receive it? Try another email
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(212, 165, 116, 0.1)',
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                  }}
                >
                  <KeyRound size={26} color="var(--accent)" />
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(22px, 4vw, 28px)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Forgot Password?
                </h1>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    maxWidth: '380px',
                    margin: '0 auto',
                  }}
                >
                  No worries! Enter your registered account email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={17}
                      color="var(--accent)"
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0.8,
                      }}
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        paddingLeft: '48px',
                        paddingRight: '16px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        borderRadius: '10px',
                        height: '48px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '14.5px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isLoading ? 0.75 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
