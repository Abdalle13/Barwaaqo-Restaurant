import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import AdminPublicRedirect from '@/components/AdminPublicRedirect';

export const metadata: Metadata = {
  title: 'Barwaaqo Restaurant | Authentic Dining & Delivery',
  description:
    'Experience premier dining, fresh Somali delicacies, online food ordering, and table reservations at Barwaaqo Restaurant.',
  keywords: ['restaurant', 'Somali food', 'online ordering', 'Barwaaqo', 'Mogadishu dining', 'halal food'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-512.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <CartProvider>
                <AdminPublicRedirect />
                {children}
              </CartProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
