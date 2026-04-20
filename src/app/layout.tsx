//✅ Server Component — solo renderiza HTML
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/app/components/organisms/ClientLayout';
import Providers from '@/app/providers/AppProviders';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
 title: 'TaskFlow',
 description: 'Gestión de tareas profesional',
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
