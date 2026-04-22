//✅ Client Component — usa usePathname
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({
 children,
}: {
 children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';

  return (
      <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#f8fafc' : '#0f172a',
        color: isDark ? '#000' : '#fff',
        transition: 'all 0.3s ease',
      }}
    >
      <header
        style={{
          backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
          color: isDark ? '#fff' : '#000',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '20px' }}>ProjectFlow</h1>

        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>
            {pathname !== '/' && (
              <Link href="/" style={{ color: 'inherit' }}>
                Inicio
              </Link>
            )}
          </span>

          <span>
            <Link href="/projects" style={{ color: 'inherit' }}>
              Proyectos
            </Link>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>
              <Link href="/tasks" style={{ color: 'inherit' }}>
                Tareas
              </Link>
            </span>

            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: isDark ? '#334155' : '#cbd5f5',
                color: isDark ? '#fff' : '#000',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {isDark ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
          </div>
        </nav>
      </header>

      <main
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '24px',
        }}
      >
        {children}
      </main>
    </div>
  );
}