'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#171916',
        color: '#F4EFE3',
        padding: '24px',
        fontFamily: 'sans-serif',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          background: '#20231E',
          border: '1px solid #383C32',
          borderRadius: '16px',
          padding: '36px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(248, 113, 113, 0.15)',
            color: '#F87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 16px auto',
          }}
        >
          !
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
          Something went wrong
        </h2>
        <p style={{ color: '#C4BDAE', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          The page could not be displayed properly. Please check your network connection and try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: '#E08A65',
            color: '#171916',
            fontWeight: '700',
            fontSize: '14px',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 28px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
