// app/layout.tsx
import { AuthProvider } from '@/context/auth-context';
import './globals.css';

export const metadata = {
  title: 'WaoSongs',
  description: 'Custom music production platform',
  icons: {
    icon: '/favicon.ico',
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
        {/* Favicon is handled by metadata */}
      </head>
      <body className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}