//✅ Client Component — usa usePathname
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
 children,
}: {
 children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <header style={{
        backgroundColor: '#1e293b',
        color: '#fff',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        }}>
            <h1 style={{ margin: 0, fontSize: '20px' }}>ProjectFlow</h1>
            <nav style={{ display: 'flex', gap: '16px' }}>
                <span>
                  {pathname !== '/' && (
                    <>
                      <Link
                        href="/"
                      >
                        Inicio
                      </Link>
                    </>
                  )}
                </span>
                <span><Link href="/projects">Proyectos</Link></span>
                <span><Link href="/tasks">Tareas</Link></span>
            </nav>
        </header>
        <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
            {children}
        </main>
    </div>
  );
}