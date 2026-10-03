'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'rgba(74, 222, 128, 0.12)',
    border: 'rgba(74, 222, 128, 0.35)',
    color: '#4ADE80',
  },
  error: {
    icon: XCircle,
    bg: 'rgba(248, 113, 113, 0.12)',
    border: 'rgba(248, 113, 113, 0.35)',
    color: '#F87171',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'rgba(251, 191, 36, 0.12)',
    border: 'rgba(251, 191, 36, 0.35)',
    color: '#FBBF24',
  },
  info: {
    icon: Info,
    bg: 'rgba(96, 165, 250, 0.12)',
    border: 'rgba(96, 165, 250, 0.35)',
    color: '#60A5FA',
  },
};

export default function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  const cfg = toastConfig[type];
  const Icon = cfg.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        maxWidth: '360px',
        animation: 'slideInRight 0.3s ease both',
        color: cfg.color,
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          flexShrink: 0,
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

/* Helper hook to use toasts easily */
export function useToast() {
  const [toast, setToast] = React.useState<{ message: string; type: ToastType } | null>(null);

  const showToast = React.useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = React.useCallback(() => setToast(null), []);

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
}
