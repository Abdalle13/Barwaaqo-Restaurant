'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * AdminPublicRedirect — Mounts globally in layout to enforce that any
 * authenticated admin or staff member is always redirected to the Admin
 * Portal when they try to access any public-facing route.
 *
 * Admins manage the system — they should never interact with the
 * customer storefront.
 */
export default function AdminPublicRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isStaff } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isStaff) return;

    // If an admin/staff member is on any non-admin public route, redirect
    const isOnAdminRoute = pathname.startsWith('/admin');
    const isOnAuthRoute = pathname === '/login' || pathname === '/register';

    if (!isOnAdminRoute && !isOnAuthRoute) {
      router.replace('/admin');
    }
  }, [user, isLoading, isStaff, pathname, router]);

  return null;
}
