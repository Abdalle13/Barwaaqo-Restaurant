'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and try again.');
      return;
    }

    if (!token) {
      setError('Missing reset token. Please request a new password reset link.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.put(`/auth/reset-password/${token}`, {
        password,
      });

      if (res.data.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'The reset link is invalid or has expired. Please request a new one.'
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
            padding: 'clamp(28px, 6vw, 44px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          }}
        >
          {isSuccess ? (
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
                Password Updated!
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '28px',
                }}
              >
                Your password has been changed successfully. You can now use your new password to sign in.
              </p>

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
                Sign In to Account
              </Link>
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
                  <ShieldCheck size={26} color="var(--accent)" />
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
                  Set New Password
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
                  Choose a strong password with at least 6 characters to secure your account.
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
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                  {error.includes('expired') || error.includes('invalid') ? (
                    <Link
                      href="/forgot-password"
                      style={{
                        color: 'var(--accent)',
                        fontSize: '12.5px',
                        textDecoration: 'underline',
                        marginLeft: '24px',
                      }}
                    >
                      Request a new reset link &rarr;
                    </Link>
                  ) : null}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      style={{
                        width: '100%',
                        paddingLeft: '48px',
                        paddingRight: '46px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        borderRadius: '10px',
                        height: '48px',
                        fontSize: '14px',
                        outline: 'none',
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
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div style={{ marginBottom: '26px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      style={{
                        width: '100%',
                        paddingLeft: '48px',
                        paddingRight: '46px',
                        backgroundColor: 'var(--bg-deep)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        borderRadius: '10px',
                        height: '48px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
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
                  {isLoading ? 'Updating Password...' : 'Reset Password'}
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
