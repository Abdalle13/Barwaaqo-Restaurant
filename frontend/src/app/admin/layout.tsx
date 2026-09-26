'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu as MenuIcon, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isStaff } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isStaff)) {
      router.push('/login');
    }
  }, [user, isLoading, isStaff, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Verifying admin access...</p>
      </div>
    );
  }

  if (!user || !isStaff) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <div className="admin-sidebar-desktop">
        <AdminSidebar />
      </div>

      {/* Mobile Overlay Sidebar */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
          <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 210 }}>
            <AdminSidebar onCloseMobile={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile Top Bar */}
        <div className="admin-mobile-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: '1px solid var(--border)', cursor: 'pointer',
              color: 'var(--text-primary)', borderRadius: '8px', padding: '7px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <MenuIcon size={20} />
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--accent)', fontSize: '18px' }}>
            {user?.name || 'Admin User'}
          </span>
        </div>

        <main style={{ flexGrow: 1, padding: 'clamp(16px, 3vw, 36px)', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        .admin-sidebar-desktop { display: flex; }
        .admin-mobile-topbar { display: none; }

        @media (max-width: 860px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-topbar {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            padding: 14px 18px;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 50;
          }
        }
      `}</style>
    </div>
  );
}
